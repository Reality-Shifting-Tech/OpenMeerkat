"use server"

import { aiAgentService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import { updateAIAgentRequest } from "@/features/ai-agents/schemas/action"
import { workspaceActionClient } from "@/lib/safe-action"

export const updateAIAgentAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(updateAIAgentRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
      parsedInput,
    } = props

    return await aiAgentService.updateAIAgent({ workspaceId, id }, parsedInput)
  })
