import type { ContactHandlers } from "@openmeerkat/sdk"
import { getUserProfile } from "../apis/user"
import type { InstagramAuthValue } from "../schemas"

export const contactHandlers: Partial<ContactHandlers<InstagramAuthValue>> = {
  getProfile: async ({ ctx, data: { sourceId } }) =>
    await getUserProfile({ ctx, psid: sourceId }),
}
