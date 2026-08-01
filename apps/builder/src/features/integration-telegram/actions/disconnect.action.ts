"use server"

import { inboxService, workspaceService } from "@openmeerkat/business"
import { db, eq, findOrFail } from "@openmeerkat/database/client"
import { integrationTelegramModel } from "@openmeerkat/database/schema"
import type { TelegramAuthValue } from "@openmeerkat/integration-telegram"
import {
  type WorkspaceIdAndIdRequestParams,
  workspaceIdAndIdRequestParams,
} from "@/features/common/schemas"
import { integrations } from "@/integration"
import { logger } from "@/lib/log"
import { workspaceActionClientAllowExpired } from "@/lib/safe-action"

export const disconnectTelegramAction = workspaceActionClientAllowExpired
  .bindArgsSchemas(workspaceIdAndIdRequestParams)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId, id],
    }: {
      bindArgsParsedInputs: WorkspaceIdAndIdRequestParams
    }) => {
      const [integrationTelegram, workspace] = await Promise.all([
        findOrFail({
          table: integrationTelegramModel,
          where: { workspaceId, id },
          message: "Integration Telegram not found",
        }),
        workspaceService.findById({ id: workspaceId }),
      ])

      try {
        await integrations.telegram.disconnect(
          integrationTelegram.auth as TelegramAuthValue,
        )
      } catch (error) {
        logger.warn(
          error,
          "Telegram disconnect API call failed — proceeding with local cleanup",
        )
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(integrationTelegramModel)
          .where(eq(integrationTelegramModel.id, integrationTelegram.id))
        await inboxService.disconnect({
          inboxId: integrationTelegram.inboxId,
          ownerId: workspace.ownerId,
          workspaceId,
          tx,
        })
      })
    },
  )
