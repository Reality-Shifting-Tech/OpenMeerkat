"use server"

import { platformCredentialService } from "@openmeerkat/business"
import {
  type StripeCredential,
  type StripeCredentialUpdate,
  stripeCredentialUpdateSchema,
} from "@openmeerkat/database/partials"
import type { UserModel } from "@openmeerkat/database/types"

import { isCloud } from "@/env"
import { authActionClient } from "@/lib/safe-action"

export const updateStripeSettingsAction = authActionClient
  .inputSchema(stripeCredentialUpdateSchema)
  .action(
    async ({
      ctx,
      parsedInput,
    }: {
      ctx: { user: UserModel }
      parsedInput: StripeCredentialUpdate
    }) => {
      const scopedUserId = isCloud() ? ctx.user.id : undefined
      const config: StripeCredential = {
        publishableKey: parsedInput.publishableKey,
        verifyToken: parsedInput.verifyToken,
        secretKey: parsedInput.secretKey,
      }

      await platformCredentialService.upsert({
        userId: scopedUserId,
        type: "stripe",
        config,
      })
    },
  )
