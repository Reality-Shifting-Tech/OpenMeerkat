"use server"

import { integrationMailchimpService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectMailchimpAction = createDisconnectAction(
  integrationMailchimpService,
  { name: "Mailchimp" },
)
