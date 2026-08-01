"use server"

import { folderService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import { editFolderSchema } from "@/features/folders/schema/action"
import { workspaceActionClient } from "@/lib/safe-action"

export const editFolderAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(editFolderSchema)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
      parsedInput,
    } = props

    await folderService.update({
      workspaceId,
      id,
      data: parsedInput,
    })
  })
