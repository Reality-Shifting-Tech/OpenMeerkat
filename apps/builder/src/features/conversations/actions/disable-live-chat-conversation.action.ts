import { conversationService } from "@openmeerkat/business"
import type { UserModel } from "@openmeerkat/database/types"
import {
  type BulkUpdateIdsRequest,
  bulkUpdateIdsRequest,
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"

export const disableLiveChatConversationAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(bulkUpdateIdsRequest)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
      ctx,
    }: {
      bindArgsParsedInputs: WorkspaceIdRequestParams
      parsedInput: BulkUpdateIdsRequest
      ctx: { user: UserModel }
    }) => {
      const conversations = await conversationService.findManyByIds({
        workspaceId,
        ids: parsedInput.ids,
      })

      await conversationService.enableBotState({
        workspaceId,
        conversations,
        userId: ctx.user.id,
        triggerContext: {
          triggerSource: "api",
          triggerHandler: "disableLiveChatConversationAction",
          triggerType: "conversation_transferred_to_bot",
        },
      })
    },
  )
