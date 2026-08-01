"use server"

import { db } from "@openmeerkat/database/client"
import { aiTriggerModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import { createAITriggerRequest } from "@/features/ai-triggers/schemas/action"
import { workspaceIdrequestParams } from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"

export const createAITriggerAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(createAITriggerRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    } = props

    await db.insert(aiTriggerModel).values({
      ...parsedInput,
      workspaceId,
      id: createId(),
    })
  })
