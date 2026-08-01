"use server"

import { contactInboxService } from "@openmeerkat/business"
import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { findOrFail } from "@openmeerkat/database/client"
import { createMessageRepository } from "@openmeerkat/database/repositories"
import { conversationModel } from "@openmeerkat/database/schema"
import { RealtimeEventType } from "@openmeerkat/partysocket-config"
import { zodBigintAsString } from "@openmeerkat/utils"
import { ChatJobAction, chatQueue } from "@openmeerkat/worker-config"
import { workspaceActionClient } from "@/lib/safe-action"
import { deleteMessageRequest } from "../schema/mutation"

export const deleteMessageAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(deleteMessageRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, conversationId],
      parsedInput: { id, createdAt },
    } = props

    const conversation = await findOrFail({
      table: conversationModel,
      where: {
        id: conversationId,
        workspaceId,
      },
      message: "Conversation not found",
    })

    // Resolve the comment's own contactInbox so the worker dispatches to the
    // exact channel the comment belongs to (the commenter's messenger inbox).
    const repository = await createMessageRepository()
    const message = await repository.findById({
      id,
      createdAt: new Date(createdAt),
      workspaceId,
    })
    if (!message) {
      throw new OpenMeerkatException("Comment not found")
    }

    // Soft-delete immediately in the DB and notify other tabs in realtime.
    // If the message has a sourceId, also queue a background job to remove it
    // from the external channel (e.g. Facebook).
    const deleted = message.sourceId
      ? await repository.deleteBySourceId(
          message.sourceId,
          workspaceId,
          message.createdAt,
        )
      : await repository.deleteById(message.id, workspaceId, message.createdAt)
    const messageIds = deleted.map((row) => row.id)

    const jobs: Promise<unknown>[] = [
      chatQueue.add(ChatJobAction.broadcastEvent, {
        type: ChatJobAction.broadcastEvent,
        data: {
          workspaceId,
          event: {
            eventType: RealtimeEventType.messageDeleted,
            data: { messageIds },
          },
        },
      }),
    ]

    if (message.sourceId && message.contactInboxId) {
      const contactInbox = await contactInboxService.findBy({
        where: { id: message.contactInboxId },
      })
      if (contactInbox) {
        jobs.push(
          chatQueue.add(ChatJobAction.deleteChannelMessage, {
            type: ChatJobAction.deleteChannelMessage,
            data: {
              conversation,
              contactInbox,
              message: { id: message.id, createdAt: message.createdAt },
            },
          }),
        )
      }
    }

    await Promise.allSettled(jobs)

    return { success: true, messageIds }
  })
