"use server"

import {
  buildContext,
  connectChannelIntegration,
  platformCredentialService,
  resolveTenantSettings,
  tagSyncService,
  updateMessengerIntegrationUserInfo,
  userQuotaService,
  workspaceService,
} from "@openmeerkat/business"
import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db, isDatabaseError } from "@openmeerkat/database/client"
import { channelTypes } from "@openmeerkat/database/partials"
import { integrationMessengerModel } from "@openmeerkat/database/schema"
import type { UserModel } from "@openmeerkat/database/types"
import type { MessengerAuthValue } from "@openmeerkat/integration-messenger"
import { integration as integrationMessenger } from "@openmeerkat/integration-messenger"
import {
  exchangeLongLivedToken,
  subscribePageToAppWebhook,
} from "@openmeerkat/integration-messenger/apis/page"
import { AuthType, SdkException } from "@openmeerkat/sdk"
import { createId } from "@openmeerkat/utils"
import { redirect } from "next/navigation"
import { isCloud } from "@/env"
import {
  BRANDING_TITLE,
  getBrandingUrl,
} from "@/features/integration-webchat/lib"
import { updateWorkspaceLogo } from "@/features/workspaces/actions/upload-logo"
import {
  FB_MESSENGER_PENDING_AUTH_COOKIE,
  readPendingAuth,
} from "@/lib/facebook-pending-auth"
import { persistIntegrationUserInfo } from "@/lib/integration-user-info"
import { logger } from "@/lib/log"
import { authActionClient } from "@/lib/safe-action"
import { type SelectPageRequest, selectPageRequest } from "../schema/action"

export const selectPageAction = authActionClient
  .inputSchema(selectPageRequest)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: SelectPageRequest
      ctx: { user: UserModel }
    }) => {
      try {
        let workspaceId = parsedInput.workspaceId
        let connectedIntegrationId: string | undefined

        if (!workspaceId && isCloud()) {
          const { blocked, reason } = await userQuotaService.getAccessState(
            ctx.user.id,
          )
          if (blocked) {
            throw reason === "mac"
              ? new OpenMeerkatException(
                  "Monthly active contact limit reached",
                  "macLimitReached",
                  403,
                )
              : new OpenMeerkatException("Trial expired", "trialExpired", 403)
          }
        }

        const platformOwnerId = parsedInput.workspaceId
          ? ((
              await workspaceService.find({
                where: { id: parsedInput.workspaceId },
              })
            )?.ownerId ?? ctx.user.id)
          : ctx.user.id

        const messengerCredential =
          await platformCredentialService.resolveForOwner({
            ownerId: platformOwnerId,
            type: "messenger",
          })

        if (!messengerCredential) {
          throw new OpenMeerkatException("Messenger App settings not found")
        }
        const messengerSettings = messengerCredential.config

        let integrationId = ""

        // The OAuth callback stored the (long-lived) user token in the
        // pending-auth cookie. Best-effort: an expired/missing cookie only
        // leaves `auth.tokens.userAccessToken`/`userId` unset.
        const pendingAuth = await readPendingAuth(
          FB_MESSENGER_PENDING_AUTH_COOKIE,
        )
        if (!pendingAuth) {
          logger.warn(
            "Messenger pending-auth cookie missing; connecting without user access token",
          )
        }

        const { brandingCtx } = await db.transaction(async (tx) => {
          const longLivedToken = await exchangeLongLivedToken(
            messengerSettings,
            parsedInput.accessToken,
          )

          if (!workspaceId) {
            const workspace = await workspaceService.create({
              tx,
              createdBy: ctx.user.id,
              data: {
                name: parsedInput.pageName,
                timezone: "UTC",
                ownerId: ctx.user.id,
              },
            })
            workspaceId = workspace.id
          }

          const { appUrl } = await resolveTenantSettings({
            workspaceId,
            tx,
          })

          await subscribePageToAppWebhook({
            pageId: parsedInput.pageId,
            accessToken: longLivedToken,
            version: messengerSettings.version,
          })

          const auth: MessengerAuthValue = {
            authType: AuthType.oauth2,
            clientId: messengerSettings.clientId,
            clientSecret: messengerSettings.clientSecret,
            redirectUrl: "",
            tokens: {
              accessToken: longLivedToken,
            },
            metadata: {
              pageId: parsedInput.pageId,
              pageName: parsedInput.pageName,
              version: messengerSettings.version,
            },
          }

          const { integration: integrationRow } =
            await connectChannelIntegration({
              tx,
              ownerId: platformOwnerId,
              inboxData: {
                id: createId(),
                workspaceId: workspaceId as string,
                name: parsedInput.pageName,
                channel: "messenger",
                sourceId: parsedInput.pageId,
              },
              insertIntegration: async (inboxId) =>
                tx
                  .insert(integrationMessengerModel)
                  .values({
                    id: createId(),
                    workspaceId: workspaceId as string,
                    inboxId,
                    pageId: parsedInput.pageId,
                    auth,
                    name: parsedInput.pageName,
                    persistentMenus: [
                      {
                        label: BRANDING_TITLE,
                        type: "url" as const,
                        url: getBrandingUrl("messenger", appUrl),
                      },
                    ],
                    conversationStarters: [],
                    personas: [],
                  })
                  .returning()
                  .then((result) => result[0]),
            })

          integrationId = integrationRow.id
          connectedIntegrationId = integrationRow?.id

          const brandingCtx = await buildContext({
            workspaceId,
            integrationType: "messenger",
            integration: { ...integrationRow, auth },
          })

          // Best-effort: the connection is already live, so a failed
          // branding write must never roll back the transaction or fail
          // the action.
          try {
            await integrationMessenger.runChannelHandler("bot", "addBranding", {
              ctx: brandingCtx,
              title: BRANDING_TITLE,
              url: getBrandingUrl("messenger", appUrl),
            })
          } catch (error) {
            logger.warn(
              { err: error },
              "Failed to add branding to Messenger persistent menu",
            )
          }

          return { brandingCtx }
        })

        await updateWorkspaceLogo({
          id: workspaceId as string,
          integration: integrationMessenger,
          ctx: brandingCtx,
        })

        if (!integrationId) {
          throw new OpenMeerkatException("Failed to create integration")
        }

        // Best-effort: the connection is already live, so a failed user-info
        // write must never fail the action (the outer catch would report a
        // bogus connect failure).
        await persistIntegrationUserInfo({
          workspaceId: workspaceId as string,
          userId: pendingAuth?.userId,
          userName: pendingAuth?.userName,
          userAccessToken: pendingAuth?.userToken,
          avatarUrl: pendingAuth?.userAvatarUrl,
          persist: (userInfo) =>
            updateMessengerIntegrationUserInfo({
              id: integrationId,
              workspaceId: workspaceId as string,
              userInfo,
            }),
        })

        // Import any labels already on the page into local tags + mappings.
        if (connectedIntegrationId) {
          await tagSyncService.enqueueChannelScan({
            workspaceId: workspaceId as string,
            channelType: channelTypes.enum.messenger,
            integrationId: connectedIntegrationId,
          })
        }

        return {
          workspaceId,
          integrationId,
        }
      } catch (error) {
        if (error instanceof OpenMeerkatException) {
          if (error.code === "channelDuplicated" && parsedInput.workspaceId) {
            redirect(
              `/space/${parsedInput.workspaceId}/settings/channels?channel=messenger&error=duplicated`,
            )
          }
          throw error
        }
        if (error instanceof SdkException) {
          logger.error({ err: error }, "Failed to connect Facebook page")
          throw error
        }
        if (isDatabaseError(error) && error.cause.code === "23505") {
          throw new OpenMeerkatException("Page already connected")
        }

        logger.error({ err: error }, "Failed to connect Facebook page")
        throw new OpenMeerkatException("Failed to connect Facebook page")
      }
    },
  )
