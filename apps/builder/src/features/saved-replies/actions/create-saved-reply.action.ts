"use server"

import { db } from "@openmeerkat/database/client"
import { savedReplyModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import { workspaceIdrequestParams } from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import { createSavedReplyRequest } from "../schema/mutation"

export const createSavedReplyAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(createSavedReplyRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    } = props
    const savedReply = await db
      .insert(savedReplyModel)
      .values({
        id: createId(),
        workspaceId,
        shortcut: parsedInput.shortcut,
        text: parsedInput.text,
      })
      .returning()
      .then((result) => result[0])

    return savedReply
  })
