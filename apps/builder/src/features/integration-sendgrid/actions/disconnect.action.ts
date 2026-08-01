"use server"

import { integrationSendGridService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectSendGridAction = createDisconnectAction(
  integrationSendGridService,
  { name: "SendGrid" },
)
