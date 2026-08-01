import {
  buildContext,
  integrationFacebookAdsService,
} from "@openmeerkat/business"
import { encryptedDataSchema, encryptUtils } from "@openmeerkat/encryption"
import { facebookAdsAuthSchema } from "@openmeerkat/integration-facebook-ads"

export const getFacebookAdsContext = async (workspaceId: string) => {
  const row =
    await integrationFacebookAdsService.findByWorkspaceIdOrFail(workspaceId)
  const auth = await encryptUtils.decryptObject(
    encryptedDataSchema.parse(row.auth),
    facebookAdsAuthSchema,
  )
  return buildContext({
    workspaceId,
    integrationType: "facebookAds",
    integration: { ...row, auth },
  })
}
