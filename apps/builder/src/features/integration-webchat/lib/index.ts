import { buildBrandingUrl } from "@openmeerkat/business/branding"
import type { ChannelType } from "@openmeerkat/database/partials"
import { isCommunity } from "@/env"

export { BRANDING_TITLE } from "@openmeerkat/business/branding"

export function getBrandingUrl(channel: ChannelType, appUrl: string) {
  return buildBrandingUrl(appUrl, channel, isCommunity())
}
