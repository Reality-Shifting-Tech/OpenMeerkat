"use server"

import { and, db, eq } from "@openmeerkat/database/client"
import { integrationMessengerModel } from "@openmeerkat/database/schema"
import { invalidateCacheByTags } from "@openmeerkat/redis"
import { zodBigintAsString } from "@openmeerkat/utils"
import { z } from "zod"
import { workspaceActionClient } from "@/lib/safe-action"

export const toggleMessengerTagSyncAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(z.object({ enabled: z.boolean() }))
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, integrationId],
      parsedInput: { enabled },
    } = props

    const updated = await db
      .update(integrationMessengerModel)
      .set({ syncTagEnabledAt: enabled ? new Date() : null })
      .where(
        and(
          eq(integrationMessengerModel.id, integrationId),
          eq(integrationMessengerModel.workspaceId, workspaceId),
        ),
      )
      .returning({
        syncTagEnabledAt: integrationMessengerModel.syncTagEnabledAt,
      })

    await invalidateCacheByTags([`workspaces:${workspaceId}#messengers`])

    return {
      syncTagEnabledAt: updated[0]?.syncTagEnabledAt ?? null,
    }
  })
