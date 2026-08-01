"use server"

import { integrationActiveCampaignService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectActiveCampaignAction = createDisconnectAction(
  integrationActiveCampaignService,
  { name: "ActiveCampaign" },
)
