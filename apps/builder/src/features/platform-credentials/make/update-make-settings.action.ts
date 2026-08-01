"use server"

import { platformCredentialService } from "@openmeerkat/business"
import {
  type MakeCredential,
  makeCredentialUpdateSchema,
} from "@openmeerkat/database/partials"

import { authActionClient } from "@/lib/safe-action"
import { credentialScopeSchema, resolveCredentialScopedUserId } from "../scope"

export const updateMakeSettingsAction = authActionClient
  .bindArgsSchemas([credentialScopeSchema])
  .inputSchema(makeCredentialUpdateSchema)
  .action(async ({ ctx, bindArgsParsedInputs: [scope], parsedInput }) => {
    const scopedUserId = resolveCredentialScopedUserId(ctx.user, scope)

    const config: MakeCredential = { inviteUrl: parsedInput.inviteUrl }

    await platformCredentialService.upsert({
      userId: scopedUserId,
      type: "make",
      config,
    })
  })
