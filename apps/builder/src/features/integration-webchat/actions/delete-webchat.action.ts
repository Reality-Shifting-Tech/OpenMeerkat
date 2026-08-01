"use server"

import { inboxService, workspaceService } from "@openmeerkat/business"
import { db, eq, findOrFail } from "@openmeerkat/database/client"
import { integrationWebchatModel } from "@openmeerkat/database/schema"
import {
  type WorkspaceIdAndIdRequestParams,
  workspaceIdAndIdRequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"

export const deleteWebchatAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdAndIdRequestParams)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId, id],
    }: {
      bindArgsParsedInputs: WorkspaceIdAndIdRequestParams
    }) => {
      const [integrationWebchat, workspace] = await Promise.all([
        findOrFail({
          table: integrationWebchatModel,
          where: { workspaceId, id },
          message: "Integration Webchat not found",
        }),
        workspaceService.findById({ id: workspaceId }),
      ])

      await db.transaction(async (tx) => {
        await tx
          .delete(integrationWebchatModel)
          .where(eq(integrationWebchatModel.id, integrationWebchat.id))

        await inboxService.disconnect({
          inboxId: integrationWebchat.inboxId,
          ownerId: workspace.ownerId,
          workspaceId,
          tx,
        })
      })
    },
  )
