"use server"

import { platformCredentialService } from "@openmeerkat/business"
import {
  type TiktokCredential,
  tiktokCredentialUpdateSchema,
} from "@openmeerkat/database/partials"
import { subscribeWebhook } from "@openmeerkat/integration-tiktok"
import { buildBrokerCallbackUrl } from "@/lib/oauth-broker"
import { authActionClient } from "@/lib/safe-action"
import { credentialScopeSchema, resolveCredentialScopedUserId } from "../scope"

export const updateTiktokSettingAction = authActionClient
  .bindArgsSchemas([credentialScopeSchema])
  .inputSchema(tiktokCredentialUpdateSchema)
  .action(async ({ ctx, bindArgsParsedInputs: [scope], parsedInput }) => {
    const scopedUserId = resolveCredentialScopedUserId(ctx.user, scope)
    const config: TiktokCredential = {
      clientId: parsedInput.clientId,
      clientSecret: parsedInput.clientSecret,
    }

    await subscribeWebhook(
      { clientId: config.clientId, clientSecret: config.clientSecret },
      buildBrokerCallbackUrl("/integrations/tiktok/webhook"),
    )

    await platformCredentialService.upsert({
      userId: scopedUserId,
      type: "tiktok",
      config,
    })
  })
