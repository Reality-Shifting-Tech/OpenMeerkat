"use server"

import { aiProviders } from "@openmeerkat/ai"
import { aiIntegrationService } from "@openmeerkat/ai/server"
import { integrationOpenRouterService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectOpenRouterAction = createDisconnectAction(
  integrationOpenRouterService,
  {
    name: "OpenRouter",
    log: false,
    afterDisconnect: async (workspaceId) => {
      await aiIntegrationService.invalidateCache(
        workspaceId,
        aiProviders.enum.openrouter,
      )
    },
  },
)
