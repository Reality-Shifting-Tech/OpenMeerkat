"use server"

import { aiProviders } from "@openmeerkat/ai"
import { aiIntegrationService } from "@openmeerkat/ai/server"
import { integrationClaudeService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectClaudeAction = createDisconnectAction(
  integrationClaudeService,
  {
    name: "Claude",
    log: false,
    afterDisconnect: async (workspaceId) => {
      await aiIntegrationService.invalidateCache(
        workspaceId,
        aiProviders.enum.claude,
      )
    },
  },
)
