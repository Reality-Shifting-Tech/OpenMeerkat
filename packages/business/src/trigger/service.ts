import { db, eq } from "@openmeerkat/database/client"
import { triggerModel } from "@openmeerkat/database/schema"
import type { TriggerModel } from "@openmeerkat/database/types"
import { BaseService } from "../base.service"

class TriggerService extends BaseService {
  async listByWorkspaceId(workspaceId: string): Promise<TriggerModel[]> {
    return await db
      .select()
      .from(triggerModel)
      .where(eq(triggerModel.workspaceId, workspaceId))
  }
}

export const triggerService = new TriggerService()
