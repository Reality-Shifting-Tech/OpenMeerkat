"use server"

import { integrationActiveCampaignService } from "@openmeerkat/business"
import {
  ActiveCampaignApiError,
  integration as activeCampaignIntegration,
} from "@openmeerkat/integration-active-campaign"
import { SdkException } from "@openmeerkat/sdk"
import { getTranslations } from "next-intl/server"
import { normalizeError } from "universal-error-normalizer"
import { workspaceIdrequestParams } from "@/features/common/schemas"
import { logger } from "@/lib/log"
import { workspaceActionClient } from "@/lib/safe-action"
import { connectActiveCampaignSchema } from "../schemas"

export const connectActiveCampaignAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(connectActiveCampaignSchema)
  .action(async ({ bindArgsParsedInputs: [workspaceId], parsedInput }) => {
    try {
      const auth = await activeCampaignIntegration.runAction(
        "validateCredentials",
        { props: parsedInput },
      )
      await integrationActiveCampaignService.upsert({ workspaceId, auth })
    } catch (error) {
      logger.error(
        { err: normalizeError(error), workspaceId },
        "Failed to connect ActiveCampaign",
      )
      if (error instanceof ActiveCampaignApiError) {
        const t = await getTranslations("activeCampaign.errors")
        throw new SdkException(t("invalidCredentials"), 400, 400)
      }
      throw error
    }
  })
