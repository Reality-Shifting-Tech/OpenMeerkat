"use server"

import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db, eq } from "@openmeerkat/database/client"
import { folderTypes } from "@openmeerkat/database/partials"
import { webhookModel } from "@openmeerkat/database/schema"
import { updateWebhookCache } from "@openmeerkat/events"
import { createId } from "@openmeerkat/utils"
import { getTranslations } from "next-intl/server"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { ensureFolderIsExists } from "@/features/folders/actions/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import { MAX_WEBHOOKS_PER_CHATBOT } from "../constants"
import {
  type CreateWebhookSchema,
  createWebhookSchema,
} from "../schemas/create-webhook-schema"

export const createWebhookAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(createWebhookSchema)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    }: {
      bindArgsParsedInputs: WorkspaceIdRequestParams
      parsedInput: CreateWebhookSchema
    }) => {
      const t = await getTranslations()

      const existingWebhooksCount = await db.$count(
        webhookModel,
        eq(webhookModel.workspaceId, workspaceId),
      )

      if (existingWebhooksCount >= MAX_WEBHOOKS_PER_CHATBOT) {
        throw new OpenMeerkatException(
          t("validation.maxItemsReached", {
            max: MAX_WEBHOOKS_PER_CHATBOT,
            feature: "webhooks",
          }),
        )
      }

      if (parsedInput.folderId) {
        await ensureFolderIsExists(
          parsedInput.folderId,
          workspaceId,
          folderTypes.enum.webhook,
        )
      }

      const { ...webhookData } = parsedInput

      const result = await db
        .insert(webhookModel)
        .values({
          id: createId(),
          ...webhookData,
          workspaceId,
          url: "",
        })
        .returning()
        .then((rows) => rows[0])

      await updateWebhookCache(workspaceId)

      return result
    },
  )
