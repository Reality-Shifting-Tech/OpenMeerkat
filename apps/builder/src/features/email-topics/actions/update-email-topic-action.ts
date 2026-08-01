"use server"

import { emailTopicService } from "@openmeerkat/business"
import {
  type WorkspaceIdAndIdRequestParams,
  workspaceIdAndIdRequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import {
  type UpdateEmailTopicRequest,
  updateEmailTopicRequest,
} from "../schema/action"

export const updateEmailTopicAction = workspaceActionClient
  .inputSchema(updateEmailTopicRequest)
  .bindArgsSchemas(workspaceIdAndIdRequestParams)
  .action(
    async ({
      parsedInput,
      bindArgsParsedInputs: [workspaceId, id],
    }: {
      parsedInput: UpdateEmailTopicRequest
      bindArgsParsedInputs: WorkspaceIdAndIdRequestParams
    }) =>
      emailTopicService.update({
        workspaceId,
        id,
        data: parsedInput,
      }),
  )
