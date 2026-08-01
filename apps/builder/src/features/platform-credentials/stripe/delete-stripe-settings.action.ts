"use server"

import { platformCredentialService } from "@openmeerkat/business"

import { isCloud } from "@/env"
import { authActionClient } from "@/lib/safe-action"

export const deleteStripeSettingsAction = authActionClient.action(
  async ({ ctx }) => {
    await platformCredentialService.remove({
      userId: isCloud() ? ctx.user.id : undefined,
      type: "stripe",
    })
  },
)
