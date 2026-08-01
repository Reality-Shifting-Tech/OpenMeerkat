import { db } from "@openmeerkat/database/client"
import { auditLogModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import type { JobSendAuditLog } from "@openmeerkat/worker-config"
import { env } from "../../env"

export const sendAuditLog = async (data: JobSendAuditLog["data"]) => {
  if (env.NEXT_PUBLIC_EDITION === "community") {
    return
  }
  const { userId, workspaceId, action, detail } = data
  await db.insert(auditLogModel).values({
    id: createId(),
    userId,
    workspaceId,
    action,
    detail,
  })
}
