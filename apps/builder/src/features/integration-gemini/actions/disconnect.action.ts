"use server"

import { aiProviders } from "@openmeerkat/ai"
import { aiIntegrationService } from "@openmeerkat/ai/server"
import { integrationGeminiService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectGeminiAction = createDisconnectAction(
  integrationGeminiService,
  {
    name: "Gemini",
    log: false,
    afterDisconnect: async (workspaceId) => {
      await aiIntegrationService.invalidateCache(
        workspaceId,
        aiProviders.enum.gemini,
      )
    },
  },
)
