import { db } from "@openmeerkat/database/client"
import { errorLogModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import type { JobSendErrorLog } from "@openmeerkat/worker-config"

export const sendErrorLog = async (data: JobSendErrorLog["data"]) => {
  const { workspaceId, error } = data
  await db.insert(errorLogModel).values({
    id: createId(),
    workspaceId,
    action: error.message ?? "Unknown error",
    detail: error.stack ?? "",
    httpCode: "500",
  })
}
