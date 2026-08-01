"use server"

import { aiAgentService } from "@openmeerkat/business"
import type { AIAgentModel } from "@openmeerkat/database/types"
import type { ListAIAgentsRequest } from "@/features/ai-agents/schemas/query"
import type { PaginatedResponse } from "@/features/common/schemas/pagination"

export async function listAIAgents(
  input: ListAIAgentsRequest,
): Promise<PaginatedResponse<AIAgentModel>> {
  return await aiAgentService.listAIAgents(input)
}
