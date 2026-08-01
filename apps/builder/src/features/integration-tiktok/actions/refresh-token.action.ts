"use server"

import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db, eq, findOrFail } from "@openmeerkat/database/client"
import { integrationTiktokModel } from "@openmeerkat/database/schema"
import type { TiktokAuthValue } from "@openmeerkat/integration-tiktok"
import { refreshAccessToken } from "@openmeerkat/integration-tiktok/apis/auth"
import { buildTokenTimestamps } from "@openmeerkat/integration-tiktok/lib/token-utils"
import {
  type WorkspaceIdAndIdRequestParams,
  workspaceIdAndIdRequestParams,
} from "@/features/common/schemas"
import { logger } from "@/lib/log"
import { workspaceActionClient } from "@/lib/safe-action"

export const refreshTiktokTokenAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdAndIdRequestParams)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId, id],
    }: {
      bindArgsParsedInputs: WorkspaceIdAndIdRequestParams
    }) => {
      await refreshTiktokToken({ workspaceId, id })
    },
  )

const refreshTiktokToken = async (ctx: { workspaceId: string; id: string }) => {
  const integrationTiktok = await findOrFail({
    table: integrationTiktokModel,
    where: { id: ctx.id, workspaceId: ctx.workspaceId },
    message: "Integration TikTok not found",
  })

  const auth = integrationTiktok.auth as TiktokAuthValue

  if (!auth.tokens.refreshToken) {
    throw new OpenMeerkatException("TikTok refresh token not available")
  }

  try {
    const newTokens = await refreshAccessToken(
      { clientId: auth.clientId, clientSecret: auth.clientSecret },
      auth.tokens.refreshToken,
    )

    const updatedAuth: TiktokAuthValue = {
      ...auth,
      tokens: {
        ...auth.tokens,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        ...buildTokenTimestamps(
          newTokens.expires_in,
          newTokens.refresh_expires_in,
        ),
      },
    }

    await db
      .update(integrationTiktokModel)
      .set({ auth: updatedAuth })
      .where(eq(integrationTiktokModel.id, ctx.id))
  } catch (error) {
    logger.error(error, "Failed to refresh TikTok token")
    throw new OpenMeerkatException("Failed to refresh TikTok token")
  }
}
