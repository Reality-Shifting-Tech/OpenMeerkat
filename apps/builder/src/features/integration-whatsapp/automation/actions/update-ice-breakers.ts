"use server"

import { buildContext } from "@openmeerkat/business"
import { findOrFail } from "@openmeerkat/database/client"
import { integrationWhatsappModel } from "@openmeerkat/database/schema"
import type { WhatsappAuthValue } from "@openmeerkat/integration-whatsapp"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { integrations } from "@/integration"
import { workspaceActionClient } from "@/lib/safe-action"
import {
  type UpdateWhatsappIceBreakerSchema,
  updateWhatsappIceBreakerSchema,
} from "../schemas/update-ice-breaker-schema"

export const updateWhatsappIceBreakerAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(updateWhatsappIceBreakerSchema)
  .action(
    async ({
      parsedInput,
      bindArgsParsedInputs: [workspaceId],
    }: {
      parsedInput: UpdateWhatsappIceBreakerSchema
      bindArgsParsedInputs: WorkspaceIdRequestParams
    }) => {
      const integrationWhatsapp = await findOrFail({
        table: integrationWhatsappModel,
        where: {
          workspaceId,
        },
        message: "Integration Whatsapp not found",
      })

      const ctx = await buildContext({
        workspaceId,
        integrationType: "whatsapp",
        integration: {
          ...integrationWhatsapp,
          auth: integrationWhatsapp.auth as WhatsappAuthValue,
        },
      })
      await integrations.whatsapp.runAction("updateConversationalAutomation", {
        ctx,
        data: {
          prompts: parsedInput.prompts.map((obj) => obj.value),
          enable_welcome_message: false,
          commands: [],
        },
      })
    },
  )
