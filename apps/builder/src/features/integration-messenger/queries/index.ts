import { db, findOrFail } from "@openmeerkat/database/client"
import { integrationMessengerModel } from "@openmeerkat/database/schema"
import type { IntegrationMessengerModel } from "@openmeerkat/database/types"

export const findIntegrationMessenger = async (
  input: Partial<Pick<IntegrationMessengerModel, "id" | "workspaceId">>,
): Promise<IntegrationMessengerModel> =>
  findOrFail({ table: integrationMessengerModel, where: input })

export const listIntegrationMessengers = async (
  input: Partial<Pick<IntegrationMessengerModel, "id" | "workspaceId">>,
): Promise<{ data: IntegrationMessengerModel[] }> => {
  const data = await db.query.integrationMessengerModel.findMany({
    where: input,
    orderBy: {
      createdAt: "asc",
    },
  })

  return { data }
}
