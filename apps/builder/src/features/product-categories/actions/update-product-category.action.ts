"use server"

import { productCategoryService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import { productCategoryFormSchema } from "../schema/action"

export const updateProductCategoryAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(productCategoryFormSchema)
  .action(
    async ({ bindArgsParsedInputs: [workspaceId, categoryId], parsedInput }) =>
      await productCategoryService.update({
        workspaceId,
        categoryId,
        ...parsedInput,
      }),
  )
