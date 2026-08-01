"use server"

import { inboxService, workspaceService } from "@openmeerkat/business"
import { db } from "@openmeerkat/database/client"
import { integrationWebchatModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import { authActionClient } from "@/lib/safe-action"
import { createWebchatRequest } from "../schema/mutation"

export const createWebchatAction = authActionClient
  .inputSchema(createWebchatRequest)
  .action(async ({ parsedInput, ctx }) => {
    const { authorizedDomains, ...rest } = parsedInput

    let workspaceId = parsedInput.workspaceId
    let ownerId = ctx.user.id

    await db.transaction(async (tx) => {
      if (workspaceId) {
        const workspace = await workspaceService.findOrFail({
          where: { id: workspaceId },
        })
        ownerId = workspace.ownerId
      } else {
        const newChatbot = await workspaceService.create({
          tx,
          createdBy: ownerId,
          data: {
            name: parsedInput.name,
            timezone: "UTC",
            ownerId,
          },
        })
        workspaceId = newChatbot.id
      }

      const webchatId = createId()
      const { inbox } = await inboxService.create({
        tx,
        ownerId,
        data: {
          id: webchatId,
          workspaceId,
          channel: "webchat",
          name: rest.name,
          sourceId: webchatId,
        },
      })

      await tx.insert(integrationWebchatModel).values({
        ...rest,
        id: webchatId,
        authorizedDomains: authorizedDomains.map((domain) => domain.value),
        workspaceId,
        inboxId: inbox.id,
        auth: {},
      })
    })

    return {
      workspaceId,
    }
  })
