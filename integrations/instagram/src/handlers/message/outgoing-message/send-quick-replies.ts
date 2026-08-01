import {
  getCanonicalReplyPayload,
  type MessageButtonTemplate,
} from "@openmeerkat/sdk"
import type { InstagramQuickReply } from "../../../schemas"

export function convertCanonicalInstagramQuickReplies(
  buttons: MessageButtonTemplate[],
): InstagramQuickReply[] {
  return buttons.map((button) => ({
    content_type: "text",
    title: button.label,
    payload: getCanonicalReplyPayload(button),
  }))
}
