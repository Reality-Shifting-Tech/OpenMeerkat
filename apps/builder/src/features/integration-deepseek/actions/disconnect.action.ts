"use server"

import { aiProviders } from "@openmeerkat/ai"
import { aiIntegrationService } from "@openmeerkat/ai/server"
import { integrationDeepSeekService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectDeepSeekAction = createDisconnectAction(
  integrationDeepSeekService,
  {
    name: "DeepSeek",
    log: false,
    afterDisconnect: async (workspaceId) => {
      await aiIntegrationService.invalidateCache(
        workspaceId,
        aiProviders.enum.deepseek,
      )
    },
  },
)
