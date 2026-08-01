"use server"

import { integrationMoosendService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectMoosendAction = createDisconnectAction(
  integrationMoosendService,
  { name: "Moosend" },
)
