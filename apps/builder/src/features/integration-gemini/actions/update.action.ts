"use server"
import { aiIntegrationService } from "@openmeerkat/ai/server"
import { db, eq, findOrFail } from "@openmeerkat/database/client"
import { integrationGeminiModel } from "@openmeerkat/database/schema"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import {
  type UpdateGeminiRequest,
  updateGeminiRequest,
} from "../schemas/request"

export const updateGeminiAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(updateGeminiRequest)
  .action(
    async ({
      parsedInput,
      bindArgsParsedInputs: [workspaceId],
    }: {
      parsedInput: UpdateGeminiRequest
      bindArgsParsedInputs: WorkspaceIdRequestParams
    }) => {
      const integrationGemini = await findOrFail({
        table: integrationGeminiModel,
        where: { workspaceId },
        message: "Integration Gemini not found",
      })

      await db
        .update(integrationGeminiModel)
        .set(parsedInput)
        .where(eq(integrationGeminiModel.id, integrationGemini.id))

      await aiIntegrationService.invalidateCache(workspaceId, "gemini")
    },
  )
