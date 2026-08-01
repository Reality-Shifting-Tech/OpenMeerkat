"use server"

import { aiProviders } from "@openmeerkat/ai"
import { aiIntegrationService } from "@openmeerkat/ai/server"
import { db, eq } from "@openmeerkat/database/client"
import {
  integrationClaudeModel,
  integrationModel,
} from "@openmeerkat/database/schema"
import { AuthType, type SecretTextAuthValue } from "@openmeerkat/sdk"
import { createId } from "@openmeerkat/utils"
import { getTranslations } from "next-intl/server"
import { returnValidationErrors } from "next-safe-action"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import { verifyClaudeApiKey } from "../lib"
import {
  type ConnectClaudeSchema,
  connectClaudeSchema,
} from "../schemas/request"

export const connectClaudeAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(connectClaudeSchema)
  .action(
    async ({
      parsedInput,
      bindArgsParsedInputs: [workspaceId],
    }: {
      parsedInput: ConnectClaudeSchema
      bindArgsParsedInputs: WorkspaceIdRequestParams
    }) => {
      const t = await getTranslations()

      if (!(await verifyClaudeApiKey(parsedInput.apiKey))) {
        return returnValidationErrors(connectClaudeSchema, {
          apiKey: {
            _errors: [t("validation.invalidApiKey")],
          },
        })
      }

      const integrationClaude = await db.query.integrationClaudeModel.findFirst(
        {
          where: { workspaceId },
        },
      )

      await db.transaction(async (tx) => {
        if (integrationClaude) {
          await tx
            .update(integrationClaudeModel)
            .set({
              model: parsedInput.model,
              auth: {
                authType: AuthType.secretText,
                secretText: parsedInput.apiKey,
              } as SecretTextAuthValue,
              temperature: parsedInput.temperature,
              maxOutputTokens: parsedInput.maxOutputTokens,
            })
            .where(eq(integrationClaudeModel.id, integrationClaude.id))
        } else {
          const integration = await tx
            .insert(integrationModel)
            .values({
              id: createId(),
              workspaceId,
              integrationType: "claude",
            })
            .returning()
            .then((result) => result[0])

          await tx.insert(integrationClaudeModel).values({
            id: createId(),
            integrationId: integration.id,
            workspaceId,
            model: parsedInput.model,
            auth: {
              authType: AuthType.secretText,
              secretText: parsedInput.apiKey,
            } as SecretTextAuthValue,
            temperature: parsedInput.temperature,
            maxOutputTokens: parsedInput.maxOutputTokens,
          })
        }
      })

      await aiIntegrationService.invalidateCache(
        workspaceId,
        aiProviders.enum.claude,
      )

      return
    },
  )
