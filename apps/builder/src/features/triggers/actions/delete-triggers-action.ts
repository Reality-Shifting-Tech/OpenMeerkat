"use server"

import { and, db, eq, inArray } from "@openmeerkat/database/client"
import { triggerModel } from "@openmeerkat/database/schema"
import { removeTriggerCache } from "@openmeerkat/events"
import {
  type BulkUpdateIdsRequest,
  bulkUpdateIdsRequest,
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"

export const deleteTriggersAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(bulkUpdateIdsRequest)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    }: {
      bindArgsParsedInputs: WorkspaceIdRequestParams
      parsedInput: BulkUpdateIdsRequest
    }) => {
      await db
        .delete(triggerModel)
        .where(
          and(
            eq(triggerModel.workspaceId, workspaceId),
            inArray(triggerModel.id, parsedInput.ids),
          ),
        )

      await removeTriggerCache(workspaceId)
    },
  )
