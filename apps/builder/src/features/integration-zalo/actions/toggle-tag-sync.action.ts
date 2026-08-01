"use server"

import { and, db, eq } from "@openmeerkat/database/client"
import { integrationZaloModel } from "@openmeerkat/database/schema"
import { invalidateCacheByTags } from "@openmeerkat/redis"
import { zodBigintAsString } from "@openmeerkat/utils"
import { z } from "zod"
import { workspaceActionClient } from "@/lib/safe-action"

export const toggleZaloTagSyncAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(z.object({ enabled: z.boolean() }))
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, integrationId],
      parsedInput: { enabled },
    } = props

    await db
      .update(integrationZaloModel)
      .set({ syncTagEnabledAt: enabled ? new Date() : null })
      .where(
        and(
          eq(integrationZaloModel.id, integrationId),
          eq(integrationZaloModel.workspaceId, workspaceId),
        ),
      )

    await invalidateCacheByTags([`workspaces:${workspaceId}#zalos`])
  })
