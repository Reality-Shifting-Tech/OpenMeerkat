import type { Context, OutgoingMessage } from "@openmeerkat/sdk"
import type { OpenmeerkatAuthValue } from "../auth"
import { getRealtimeClient } from "./client"

export const broadcastMessageToWorkspaceParty = (
  ctx: Context<OpenmeerkatAuthValue>,
  message: OutgoingMessage,
) => {
  const websocketClient = getRealtimeClient(ctx)
  websocketClient
    .post(`/parties/workspaces/${message.workspaceId}`, {
      json: {
        eventType: "messageCreated",
        data: message,
      },
    })
    .catch(() => {
      // Ignore errors
    })
}
