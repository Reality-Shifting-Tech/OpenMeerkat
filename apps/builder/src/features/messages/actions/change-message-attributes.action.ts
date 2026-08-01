"use server"

import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db, findOrFail } from "@openmeerkat/database/client"
import { createMessageRepository } from "@openmeerkat/database/repositories"
import { conversationModel } from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import { ChatJobAction, chatQueue } from "@openmeerkat/worker-config"
import { workspaceActionClient } from "@/lib/safe-action"
import { changeMessageAttributesRequest } from "../schema/mutation"

export const changeMessageAttributesAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(changeMessageAttributesRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, conversationId],
      parsedInput: { messageId, createdAt, liked, hidden },
    } = props

    const conversation = await findOrFail({
      table: conversationModel,
      where: { id: conversationId, workspaceId },
      message: "Conversation not found",
    })

    const repository = await createMessageRepository()
    const message = await repository.findById({
      id: messageId,
      createdAt,
      workspaceId,
    })
    if (!message) {
      throw new OpenMeerkatException("Message not found")
    }

    const contactInbox = await db.query.contactInboxModel.findFirst({
      where: { id: message.contactInboxId },
    })
    if (!contactInbox) {
      throw new OpenMeerkatException("Inbox not found")
    }

    await Promise.allSettled([
      chatQueue.add(ChatJobAction.changeChannelMessageState, {
        type: ChatJobAction.changeChannelMessageState,
        data: {
          conversation,
          contactInbox,
          message: { id: messageId, createdAt: message.createdAt },
          liked,
          hidden,
        },
      }),
    ])

    return { success: true, messageId }
  })
