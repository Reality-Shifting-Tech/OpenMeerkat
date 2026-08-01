"use server"

import { integrationKlaviyoService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectKlaviyoAction = createDisconnectAction(
  integrationKlaviyoService,
  { name: "Klaviyo" },
)
