"use server"

import { integrationDripService } from "@openmeerkat/business"
import {
  DripNoAccountError,
  integration as dripIntegration,
} from "@openmeerkat/integration-drip"
import { SdkException } from "@openmeerkat/sdk"
import { getTranslations } from "next-intl/server"
import { normalizeError } from "universal-error-normalizer"
import { workspaceIdrequestParams } from "@/features/common/schemas"
import { logger } from "@/lib/log"
import { workspaceActionClient } from "@/lib/safe-action"
import { connectDripSchema } from "../schemas"

export const connectDripAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(connectDripSchema)
  .action(async ({ bindArgsParsedInputs: [workspaceId], parsedInput }) => {
    try {
      const auth = await dripIntegration.runAction("validateCredentials", {
        props: parsedInput,
      })
      await integrationDripService.upsert({ workspaceId, auth })
    } catch (error) {
      logger.error(
        { err: normalizeError(error), workspaceId },
        "Failed to connect Drip",
      )
      if (error instanceof DripNoAccountError) {
        const t = await getTranslations("drip.errors")
        throw new SdkException(t("noAccount"), 400, 400)
      }
      throw error
    }
  })
