"use server"

import { integrationDripService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectDripAction = createDisconnectAction(
  integrationDripService,
  { name: "Drip" },
)
