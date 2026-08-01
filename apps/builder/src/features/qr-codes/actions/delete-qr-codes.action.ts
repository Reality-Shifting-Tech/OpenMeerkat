"use server"

import { and, db, eq, inArray } from "@openmeerkat/database/client"
import { reflinkModel } from "@openmeerkat/database/schema"
import { invalidateCacheByTags } from "@openmeerkat/redis"
import {
  type BulkUpdateIdsRequest,
  bulkUpdateIdsRequest,
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import { getWorkspaceCacheTag } from "../queries"

export const deleteQrCodesAction = workspaceActionClient
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
        .delete(reflinkModel)
        .where(
          and(
            eq(reflinkModel.workspaceId, workspaceId),
            eq(reflinkModel.type, "qrCode"),
            inArray(reflinkModel.id, parsedInput.ids),
          ),
        )

      await invalidateCacheByTags([getWorkspaceCacheTag(workspaceId)])
    },
  )
