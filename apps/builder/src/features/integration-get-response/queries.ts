import { integrationGetResponseService } from "@openmeerkat/business"
import { encryptedDataSchema, encryptUtils } from "@openmeerkat/encryption"
import { getResponseAuthSchema } from "@openmeerkat/integration-get-response"

export const getGetResponseAuth = async (workspaceId: string) => {
  const row =
    await integrationGetResponseService.findByWorkspaceIdOrFail(workspaceId)
  const auth = await encryptUtils.decryptObject(
    encryptedDataSchema.parse(row.auth),
    getResponseAuthSchema,
  )
  return { auth, row }
}
