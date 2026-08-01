"use server"

import {
  findMessengerIntegrationByIdForWorkspace,
  platformCredentialService,
} from "@openmeerkat/business"
import { OpenMeerkatException } from "@openmeerkat/business/errors"
import type { WorkspaceModel } from "@openmeerkat/database/types"
import { generateAuthUrl } from "@openmeerkat/integration-messenger"
import { zodBigintAsString } from "@openmeerkat/utils"
import { redirect } from "next/navigation"
import { getOriginUrlFromHeader } from "@/lib/domain"
import { buildBrokerCallbackUrl } from "@/lib/oauth-broker"
import { workspaceActionClient } from "@/lib/safe-action"

/**
 * Start an OAuth reconnect for an existing Messenger integration: send the
 * user back through the Facebook dialog with `reconnectIntegrationId` in the
 * OAuth state so the callback refreshes this row's tokens instead of running
 * the page-select connect flow. Mirrors `connectFacebookAds`.
 */
export const reconnectMessengerAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId, integrationId],
      ctx,
    }: {
      bindArgsParsedInputs: readonly [string, string]
      ctx: { workspace: WorkspaceModel }
    }) => {
      const integrationMessenger =
        await findMessengerIntegrationByIdForWorkspace({
          id: integrationId,
          workspaceId,
        })
      if (!integrationMessenger) {
        throw new OpenMeerkatException("Integration Messenger not found")
      }

      const messengerCredential =
        await platformCredentialService.resolveForOwner({
          ownerId: ctx.workspace.ownerId,
          type: "messenger",
        })
      if (!messengerCredential) {
        throw new OpenMeerkatException("Messenger App settings not found")
      }

      const redirectUrl = buildBrokerCallbackUrl(
        "/integrations/messenger/callback",
      )
      const baseUrl = await getOriginUrlFromHeader()
      const referer = new URL(
        `/space/${workspaceId}/settings/channels?channel=messenger`,
        baseUrl,
      ).toString()

      const authUrl = generateAuthUrl({
        clientId: messengerCredential.config.clientId,
        version: messengerCredential.config.version,
        redirectUrl,
        stateParams: {
          workspaceId,
          referer,
          reconnectIntegrationId: integrationId,
        },
      })

      return redirect(authUrl)
    },
  )
