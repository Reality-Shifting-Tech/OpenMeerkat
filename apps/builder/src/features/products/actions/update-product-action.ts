"use server"

import { productService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import { type ProductFormRequest, productFormRequest } from "../schema/action"

export const updateProductAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(productFormRequest)
  .action(
    async ({ bindArgsParsedInputs: [workspaceId, productId], parsedInput }) =>
      await updateProduct({ workspaceId, productId, ...parsedInput }),
  )

export const updateProduct = async (
  input: ProductFormRequest & { workspaceId: string; productId: string },
) => {
  await productService.updateFull(input)
}
