import { integrationMailerLiteService } from "@openmeerkat/business"
import { encryptedDataSchema, encryptUtils } from "@openmeerkat/encryption"
import { mailerLiteAuthSchema } from "@openmeerkat/integration-mailer-lite"

export const getMailerLiteAuth = async (workspaceId: string) => {
  const row =
    await integrationMailerLiteService.findByWorkspaceIdOrFail(workspaceId)
  const auth = await encryptUtils.decryptObject(
    encryptedDataSchema.parse(row.auth),
    mailerLiteAuthSchema,
  )
  return { auth, row }
}
