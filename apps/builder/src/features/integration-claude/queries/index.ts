import { db } from "@openmeerkat/database/client"
import type { IntegrationClaudeResource } from "../schemas/resource"

export const findIntegrationClaude = async ({
  workspaceId,
}: {
  workspaceId: string
}): Promise<IntegrationClaudeResource | null> =>
  (await db.query.integrationClaudeModel.findFirst({
    where: {
      workspaceId,
    },
  })) ?? null
