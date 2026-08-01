import {
  connectChannelIntegration,
  workspaceService,
} from "@openmeerkat/business"
import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db } from "@openmeerkat/database/client"
import type { TiktokCredential } from "@openmeerkat/database/partials"
import { integrationTiktokModel } from "@openmeerkat/database/schema"
import type { TiktokAuthValue } from "@openmeerkat/integration-tiktok"
import { createId } from "@openmeerkat/utils"
import { redirect } from "next/navigation"
import { integrations } from "@/integration"

export async function connectTiktokHandler({
  tiktokSettings,
  workspaceId,
  req,
  redirectUrl,
}: {
  tiktokSettings: TiktokCredential
  workspaceId: string
  req: Request
  redirectUrl: string
}) {
  const authValue = (await integrations.tiktok.handleRequest?.({
    config: {
      ...tiktokSettings,
      redirectUrl,
    },
    req,
  })) as TiktokAuthValue

  const openId = authValue.metadata.openId
  const displayName = authValue.metadata.displayName

  const { ownerId } = await workspaceService.findById({ id: workspaceId })

  try {
    await db.transaction(async (tx) => {
      await connectChannelIntegration({
        tx,
        ownerId,
        inboxData: {
          workspaceId,
          name: displayName,
          channel: "tiktok",
          sourceId: authValue.metadata.username,
        },
        insertIntegration: async (inboxId) => {
          await tx
            .insert(integrationTiktokModel)
            .values({
              id: createId(),
              inboxId,
              workspaceId,
              openId,
              name: displayName,
              auth: authValue,
            })
            .onConflictDoUpdate({
              target: [integrationTiktokModel.openId],
              set: { auth: authValue, name: displayName },
            })
        },
      })
    })
  } catch (error) {
    if (
      error instanceof OpenMeerkatException &&
      error.code === "channelDuplicated"
    ) {
      redirect(
        `/space/${workspaceId}/settings/channels?channel=tiktok&error=duplicated`,
      )
    }
    throw error
  }
}
