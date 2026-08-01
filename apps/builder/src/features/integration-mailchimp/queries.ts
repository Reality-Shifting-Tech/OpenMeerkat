import { integrationMailchimpService } from "@openmeerkat/business"
import { encryptedDataSchema, encryptUtils } from "@openmeerkat/encryption"
import { mailchimpAuthSchema } from "@openmeerkat/integration-mailchimp"

export const getMailchimpAuth = async (workspaceId: string) => {
  const row =
    await integrationMailchimpService.findByWorkspaceIdOrFail(workspaceId)
  const auth = await encryptUtils.decryptObject(
    encryptedDataSchema.parse(row.auth),
    mailchimpAuthSchema,
  )
  return { auth, row }
}
