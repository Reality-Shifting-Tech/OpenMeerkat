"use server"

import { integrationMailerLiteService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectMailerLiteAction = createDisconnectAction(
  integrationMailerLiteService,
  { name: "MailerLite" },
)
