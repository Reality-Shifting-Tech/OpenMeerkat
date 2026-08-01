import { db } from "@openmeerkat/database/client"
import type { IntegrationDeepseekResource } from "../schemas/resource"

export const findIntegrationDeepSeek = async ({
  workspaceId,
}: {
  workspaceId: string
}): Promise<IntegrationDeepseekResource | null> =>
  (await db.query.integrationDeepseekModel.findFirst({
    where: { workspaceId },
  })) ?? null
