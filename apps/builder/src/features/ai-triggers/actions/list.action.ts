import { db, relationsFilterToSQL } from "@openmeerkat/database/client"
import { aiTriggerModel } from "@openmeerkat/database/schema"
import {
  getPaginationWithDefaults,
  likeContains,
  parseOrderByAsObject,
} from "@openmeerkat/database/utils"
import type {
  AITriggerCollection,
  ListAITriggersRequest,
} from "@/features/ai-triggers/schemas/query"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"

export const listAITriggers = async (
  input: ListAITriggersRequest,
): Promise<AITriggerCollection> => {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)

  const where = {
    workspaceId: input.workspaceId,
    name: input.name
      ? {
          ilike: likeContains(input.name),
        }
      : undefined,
  }

  const pagination = getPaginationWithDefaults(input)
  const orderBy = parseOrderByAsObject(aiTriggerModel, input)

  const [data, total] = await Promise.all([
    db.query.aiTriggerModel.findMany({
      where,
      orderBy,
      ...pagination,
    }),
    db.$count(aiTriggerModel, relationsFilterToSQL(aiTriggerModel, where)),
  ])

  const pageCount = Math.ceil(total / pagination.limit)

  return { data, pageCount }
}
