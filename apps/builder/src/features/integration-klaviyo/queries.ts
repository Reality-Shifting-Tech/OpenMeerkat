import { buildContext, integrationKlaviyoService } from "@openmeerkat/business"
import { encryptedDataSchema, encryptUtils } from "@openmeerkat/encryption"
import { klaviyoAuthSchema } from "@openmeerkat/integration-klaviyo"

export const getKlaviyoContext = async (workspaceId: string) => {
  const row =
    await integrationKlaviyoService.findByWorkspaceIdOrFail(workspaceId)
  const auth = await encryptUtils.decryptObject(
    encryptedDataSchema.parse(row.auth),
    klaviyoAuthSchema,
  )
  return buildContext({
    workspaceId,
    integrationType: "klaviyo",
    integration: { ...row, auth },
  })
}
