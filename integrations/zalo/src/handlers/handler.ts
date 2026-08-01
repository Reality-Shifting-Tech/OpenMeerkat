import type { ContactHandlers } from "@openmeerkat/sdk"
import { getUserProfile } from "../api"
import type { ZaloAuthValue } from "../schema"

const getProfile: ContactHandlers<ZaloAuthValue>["getProfile"] = async ({
  ctx,
  data: { sourceId },
}) => {
  const profile = await getUserProfile({ ctx, psid: sourceId })
  return profile
}

export const contactHandlers = {
  getProfile,
}
