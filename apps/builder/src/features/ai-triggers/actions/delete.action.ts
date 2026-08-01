"use server"

import { and, db, eq, inArray } from "@openmeerkat/database/client"
import { aiTriggerModel } from "@openmeerkat/database/schema"
import {
  bulkUpdateIdsRequest,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"

export const deleteAITriggerAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(bulkUpdateIdsRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId],
      parsedInput: { ids },
    } = props

    await db
      .delete(aiTriggerModel)
      .where(
        and(
          eq(aiTriggerModel.workspaceId, workspaceId),
          inArray(aiTriggerModel.id, ids),
        ),
      )
  })
