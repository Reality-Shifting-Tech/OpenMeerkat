"use server"

import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db } from "@openmeerkat/database/client"
import { aiFileModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import { AIJobAction, aiAgentQueue } from "@openmeerkat/worker-config"
import { getTranslations } from "next-intl/server"
import { workspaceIdrequestParams } from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import { createAIFileRequest } from "../schemas"

export const createAIFileAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(createAIFileRequest)
  .action(async ({ bindArgsParsedInputs, parsedInput }) => {
    const [workspaceId] = bindArgsParsedInputs

    const hasOpenAI = await db.query.integrationOpenaiModel.findFirst({
      where: { workspaceId },
      columns: { id: true },
    })
    const hasGemini = await db.query.integrationGeminiModel.findFirst({
      where: { workspaceId },
      columns: { id: true },
    })

    if (!(hasOpenAI || hasGemini)) {
      const t = await getTranslations("aiFiles")
      throw new OpenMeerkatException(t("noEmbeddingProvider"))
    }

    const created = await db
      .insert(aiFileModel)
      .values({
        ...parsedInput,
        id: createId(),
        workspaceId,
      })
      .returning({ id: aiFileModel.id })

    // Enqueue embedding job right after creation
    await aiAgentQueue.add(AIJobAction.processAIFile, {
      type: AIJobAction.processAIFile,
      data: {
        aiFileId: created[0].id,
      },
    })
  })
