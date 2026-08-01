import { buildContext, integrationSendGridService } from "@openmeerkat/business"
import { encryptedDataSchema, encryptUtils } from "@openmeerkat/encryption"
import { sendGridAuthSchema } from "@openmeerkat/integration-sendgrid"

export const getSendGridContext = async (workspaceId: string) => {
  const row =
    await integrationSendGridService.findByWorkspaceIdOrFail(workspaceId)
  const auth = await encryptUtils.decryptObject(
    encryptedDataSchema.parse(row.auth),
    sendGridAuthSchema,
  )
  return buildContext({
    workspaceId,
    integrationType: "sendGrid",
    integration: { ...row, auth },
  })
}
