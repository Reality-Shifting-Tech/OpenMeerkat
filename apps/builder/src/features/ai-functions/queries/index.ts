import { db } from "@openmeerkat/database/client"
import type { AIFunctionModel } from "@openmeerkat/database/types"
import type { PaginatedResponse } from "@/features/common/schemas/pagination"
import type { ListAIFunctionsRequest } from "../schemas/action"

export async function listAIFunctions(
  input: ListAIFunctionsRequest,
): Promise<PaginatedResponse<AIFunctionModel>> {
  const data = await db.query.aiFunctionModel.findMany({
    where: {
      workspaceId: input.workspaceId,
    },
  })

  return { data, pageCount: 1 }
}
