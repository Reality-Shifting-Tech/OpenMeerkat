import { db, eq } from "@openmeerkat/database/client"
import { integrationZaloModel } from "@openmeerkat/database/schema"
import { BaseService } from "../base.service"

class ZaloIntegrationService extends BaseService {
  async findAll(): Promise<
    Array<{ id: string; auth: Record<string, unknown> }>
  > {
    return await db
      .select({ id: integrationZaloModel.id, auth: integrationZaloModel.auth })
      .from(integrationZaloModel)
  }

  async updateAuth(id: string, auth: Record<string, unknown>): Promise<void> {
    await db
      .update(integrationZaloModel)
      .set({ auth })
      .where(eq(integrationZaloModel.id, id))
  }
}

export const zaloIntegrationService = new ZaloIntegrationService()
