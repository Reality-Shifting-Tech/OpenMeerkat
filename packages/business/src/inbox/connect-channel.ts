import type { DatabaseClient } from "@openmeerkat/database/client"
import type { inboxModel } from "@openmeerkat/database/schema"
import type { InboxModel } from "@openmeerkat/database/types"
import { channelDuplicatedException } from "../errors"
import { inboxService } from "./service"

export async function connectChannelIntegration<T>(props: {
  tx: DatabaseClient
  ownerId: string
  inboxData: Omit<typeof inboxModel.$inferInsert, "id"> & { id?: string }
  insertIntegration: (inboxId: string, wasCreated: boolean) => Promise<T>
}): Promise<{ inbox: InboxModel; wasCreated: boolean; integration: T }> {
  const { tx, ownerId, inboxData, insertIntegration } = props

  if (
    inboxData.sourceId &&
    (await inboxService.isConnected({
      tx,
      channel: inboxData.channel,
      sourceId: inboxData.sourceId,
      workspaceId: inboxData.workspaceId ?? "",
    }))
  ) {
    throw channelDuplicatedException()
  }

  const { inbox, wasCreated } = await inboxService.create({
    tx,
    ownerId,
    data: inboxData,
  })

  const integration = await insertIntegration(inbox.id, wasCreated)

  return { inbox, wasCreated, integration }
}
