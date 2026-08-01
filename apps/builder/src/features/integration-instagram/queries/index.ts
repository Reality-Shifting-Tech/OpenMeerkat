import { db, findOrFail } from "@openmeerkat/database/client"
import { integrationInstagramModel } from "@openmeerkat/database/schema"
import type { IntegrationInstagramModel } from "@openmeerkat/database/types"

export const findIntegrationInstagram = async (where: {
  workspaceId: string
  id: string
}): Promise<IntegrationInstagramModel> =>
  findOrFail({
    table: integrationInstagramModel,
    where,
  })

export const listIntegrationInstagrams = async ({
  workspaceId,
}: {
  workspaceId: string
}): Promise<{ data: IntegrationInstagramModel[] }> => {
  const data = await db.query.integrationInstagramModel.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  return { data }
}
