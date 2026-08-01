import { integrationMoosendService } from "@openmeerkat/business"
import { encryptedDataSchema, encryptUtils } from "@openmeerkat/encryption"
import { moosendAuthSchema } from "@openmeerkat/integration-moosend"

export const getMoosendAuth = async (workspaceId: string) => {
  const row = await integrationMoosendService.findByWorkspaceId(workspaceId)
  if (!row) {
    return null
  }
  const auth = await encryptUtils.decryptObject(
    encryptedDataSchema.parse(row.auth),
    moosendAuthSchema,
  )
  return { auth, row }
}
