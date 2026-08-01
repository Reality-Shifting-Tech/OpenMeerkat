"use server"

import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db, eq } from "@openmeerkat/database/client"
import { folderTypes } from "@openmeerkat/database/partials"
import { triggerModel } from "@openmeerkat/database/schema"
import { updateTriggerCache } from "@openmeerkat/events"
import { createId } from "@openmeerkat/utils"
import { getTranslations } from "next-intl/server"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { ensureFolderIsExists } from "@/features/folders/actions/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import { MAX_TRIGGERS_PER_CHATBOT } from "../constants"
import {
  type CreateTriggerSchema,
  createTriggerSchema,
} from "../schema/mutation"

export const createTriggerAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(createTriggerSchema)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    }: {
      bindArgsParsedInputs: WorkspaceIdRequestParams
      parsedInput: CreateTriggerSchema
    }) => {
      const t = await getTranslations()

      const existingTriggersCount = await db.$count(
        triggerModel,
        eq(triggerModel.workspaceId, workspaceId),
      )

      if (existingTriggersCount >= MAX_TRIGGERS_PER_CHATBOT) {
        throw new OpenMeerkatException(
          t("validation.maxItemsReached", {
            max: MAX_TRIGGERS_PER_CHATBOT,
            feature: "triggers",
          }),
        )
      }

      if (parsedInput.folderId) {
        await ensureFolderIsExists(
          parsedInput.folderId,
          workspaceId,
          folderTypes.enum.trigger,
        )
      }

      const { ...triggerData } = parsedInput

      const result = await db
        .insert(triggerModel)
        .values({
          id: createId(),
          ...triggerData,
          actions: [],
          workspaceId,
        })
        .returning()
        .then((rows) => rows[0])

      await updateTriggerCache(workspaceId)

      return result
    },
  )
