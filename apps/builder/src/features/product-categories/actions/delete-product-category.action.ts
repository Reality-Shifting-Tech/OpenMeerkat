"use server"

import { productCategoryService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClientAllowExpired } from "@/lib/safe-action"

export const deleteProductCategoryAction = workspaceActionClientAllowExpired
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(async ({ bindArgsParsedInputs: [workspaceId, categoryId] }) => {
    await productCategoryService.delete({ workspaceId, categoryId })
  })
