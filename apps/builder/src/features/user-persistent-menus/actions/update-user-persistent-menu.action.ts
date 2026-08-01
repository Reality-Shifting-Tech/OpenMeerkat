"use server"

import { updateUserPersistentMenu } from "@openmeerkat/database/repositories"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import { updateUserPersistentMenuRequest } from "../schema/action"

export const updateUserPersistentMenuAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(updateUserPersistentMenuRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
      parsedInput,
    } = props

    await updateUserPersistentMenu({
      id,
      workspaceId,
      name: parsedInput.name,
      menus: parsedInput.persistentMenus,
    })
  })
