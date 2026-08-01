"use server"

import { db, findOrFail } from "@openmeerkat/database/client"
import { integrationSmtpModel } from "@openmeerkat/database/schema"
import type { IntegrationSmtpModel } from "@openmeerkat/database/types"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"
import type { IntegrationSmtpResource } from "../schemas/resource"

export const findIntegrationSmtp = async (
  input: Partial<Pick<IntegrationSmtpModel, "id" | "workspaceId">>,
): Promise<IntegrationSmtpModel> =>
  findOrFail({ table: integrationSmtpModel, where: input })

export const listIntegrationSmtps = async (input: {
  workspaceId: string
}): Promise<{ data: IntegrationSmtpResource[] }> => {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)

  const data = await db.query.integrationSmtpModel.findMany({
    where: {
      workspaceId: input.workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return {
    data: data.map(({ id, name, fromAddress }) => ({
      id,
      name,
      fromAddress,
    })),
  }
}
