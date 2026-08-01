import { decodeRef, encodeRef, type RefConfig } from "@openmeerkat/business"
import { findOrFail } from "@openmeerkat/database/client"
import {
  flowModel,
  flowVersionModel,
  reflinkModel,
} from "@openmeerkat/database/schema"
import type {
  ContactInboxModel,
  ConversationModel,
} from "@openmeerkat/database/types"
import { emit } from "@openmeerkat/event-bus"
import {
  emitContactReferredANewContact,
  emitContactReferredExistingContact,
} from "@openmeerkat/events"
import { webhookChannelOrigin } from "@openmeerkat/events/context"
import { flowEventTypeSchema } from "@openmeerkat/flow-config"
import {
  IntegrationJobAction,
  type IntegrationJobRunRef,
  integrationQueue,
} from "@openmeerkat/worker-config"
import { detectConversationAndContactInbox } from "../../lib/db"
import { logger } from "../../lib/logger"
import { saveResultToCustomField } from "../utils/contact"

export async function runRef(data: IntegrationJobRunRef["data"]) {
  const { conversationId, contactInboxId, ref, messageId, isNewContact } = data
  const { conversation, contactInbox } =
    await detectConversationAndContactInbox({
      conversationId,
      contactInboxId,
    })

  const refData = decodeRef(ref)
  if (!refData) {
    return
  }

  const startTime = Date.now()
  const emitSuccess = () => {
    if (!messageId) {
      return
    }
    emit("analytics:dashboard", {
      eventType: "message:bot_received",
      workspaceId: conversation.workspaceId,
      conversationId: conversation.id,
      messageId,
      occurredAt: new Date(),
      hasResponse: true,
      responseType: "flow",
      routeType: "flow",
      result: "success",
      aiProvider: "none",
      metadata: {
        latency: Date.now() - startTime,
        triggerContext: {
          triggerSource: "worker",
          triggerHandler: "runRef",
          triggerType: "contact_ref",
        },
      },
    })
  }
  const emitFallback = () => {
    if (!messageId) {
      return
    }
    emit("analytics:dashboard", {
      eventType: "message:bot_received",
      workspaceId: conversation.workspaceId,
      conversationId: conversation.id,
      messageId,
      occurredAt: new Date(),
      hasResponse: false,
      responseType: "flow",
      routeType: "flow",
      result: "fallback",
      aiProvider: "none",
      metadata: {
        latency: Date.now() - startTime,
        fallbackReason: "handler_error_to_fallback",
        triggerContext: {
          triggerSource: "worker",
          triggerHandler: "runRef",
          triggerType: "contact_ref_failed",
        },
      },
    })
  }

  try {
    if (refData.type === "draft") {
      logger.debug(`Draft ref: ${ref}`)
      const { flowId } = refData
      if (!flowId) {
        logger.warn(`Invalid draft ref: ${ref}`)
        return
      }

      const flowVersion = await findOrFail({
        table: flowVersionModel,
        where: { flowId, isDraft: true },
        message: "Flow version not found",
      })

      await integrationQueue.add(IntegrationJobAction.sendFlow, {
        type: IntegrationJobAction.sendFlow,
        data: {
          conversationId: conversation,
          contactInboxId: contactInbox,
          flowId: flowVersion.flowId,
          flowVersionId: flowVersion.id,
          origin: webhookChannelOrigin(),
        },
      })
      emitSuccess()
      return
    }

    if (refData.type === "flow") {
      logger.debug(`Start flow ref: ${ref}`)
      const { flowId, nodeId } = refData
      if (!flowId) {
        logger.warn(`Invalid flow ref: ${ref}`)
        return
      }

      const flow = await findOrFail({
        table: flowModel,
        where: { id: flowId, workspaceId: conversation.workspaceId },
        message: "Flow not found",
      })

      await integrationQueue.add(IntegrationJobAction.sendFlow, {
        type: IntegrationJobAction.sendFlow,
        data: {
          conversationId: conversation,
          contactInboxId: contactInbox,
          flowId: flow.id,
          nodeId,
          origin: webhookChannelOrigin(),
        },
      })
      emitSuccess()
      return
    }

    // Trigger reflink
    await handleReflink({
      conversation,
      contactInbox,
      refData,
      isNewContact,
    })
    emitSuccess()
  } catch (error) {
    emitFallback()
    throw error
  }
}

async function handleReflink(props: {
  conversation: ConversationModel
  contactInbox: ContactInboxModel
  refData: Extract<RefConfig, { type: "reflink" | "qr-code" }>
  isNewContact?: boolean
}) {
  const { conversation, contactInbox, isNewContact } = props
  const refData = props.refData

  const reflink = await findOrFail({
    table: reflinkModel,
    where: {
      name: encodeRef(refData),
      workspaceId: conversation.workspaceId,
    },
    message: "Reflink not found",
  })

  await emit(flowEventTypeSchema.enum["flow:ref"], {
    context: {
      workspaceId: conversation.workspaceId,
      contactId: conversation.contactId,
      conversationId: conversation.id,
      channel: contactInbox.channel,
      contactInboxId: contactInbox.id,
    },
    action: {
      refId: reflink.id,
      refType: "entryPoint",
    },
    occurredAt: new Date(),
  })

  await integrationQueue.add(IntegrationJobAction.sendFlow, {
    type: IntegrationJobAction.sendFlow,
    data: {
      conversationId: conversation,
      contactInboxId: contactInbox,
      flowId: reflink.flowId,
      origin: webhookChannelOrigin(),
    },
  })

  const emitReferral = isNewContact
    ? emitContactReferredANewContact
    : emitContactReferredExistingContact
  await emitReferral(
    conversation.workspaceId,
    conversation.contactId,
    refData.name,
    reflink.id,
  )

  if (reflink.customFieldId) {
    await saveResultToCustomField({
      contactId: conversation.contactId,
      customFieldId: reflink.customFieldId,
      fullText: refData.name,
      workspaceId: conversation.workspaceId,
    })
  }

  // Support additional custom fields

  // // Trying to find reflink by custom field
  // const refParts = ref.split("--").map((part) => part.trim())
  // if (!refParts[0]) {
  //   logger.warn(`Invalid ref: ${ref}`)
  //   return
  // }

  // // Save data from custom field
  // let customFieldId: string | null = null
  // let customField: CustomFieldModel | null | undefined = null
  // for (let i = 0; i < refParts.length; i++) {
  //   if (i === 0) {
  //     customFieldId = reflink.customFieldId ?? ""
  //   } else if (i % 2 === 0) {
  //     customFieldId = refParts[i]
  //   }

  //   if (i % 2 === 0) {
  //     if (customFieldId) {
  //       customField = await db.query.customFieldModel.findFirst({
  //         where: {
  //           workspaceId: conversation.workspaceId,
  //           id: customFieldId,
  //         },
  //       })
  //     } else {
  //       customField = null
  //     }
  //   }

  //   // Trying to find custom field by name, then update contact custom field
  //   if (i % 2 === 1 && refParts[i] && customField) {
  //     await db
  //       .insert(contactCustomFieldModel)
  //       .values({
  //         id: createId(),
  //         contactId: conversation.contactId,
  //         customFieldId: customField.id,
  //         value: refParts[i],
  //       })
  //       .onConflictDoUpdate({
  //         target: [
  //           contactCustomFieldModel.contactId,
  //           contactCustomFieldModel.customFieldId,
  //         ],
  //         set: {
  //           value: refParts[i],
  //         },
  //       })
  //   }
  // }
}
