import { db, relationsFilterToSQL } from "@openmeerkat/database/client"
import { errorLogModel } from "@openmeerkat/database/schema"
import {
  getPaginationWithDefaults,
  likeContains,
  parseOrderByAsObject,
} from "@openmeerkat/database/utils"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"
import type {
  ListErrorLogsRequest,
  ListErrorLogsResponse,
} from "../schemas/query"

export async function listErrorLogs(
  input: ListErrorLogsRequest,
): Promise<ListErrorLogsResponse> {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)

  const where = {
    workspaceId: input.workspaceId,
    ...(input.keyword
      ? {
          OR: [
            { action: { ilike: likeContains(input.keyword) } },
            { detail: { ilike: likeContains(input.keyword) } },
          ],
        }
      : {}),
  }

  const pagination = getPaginationWithDefaults(input)
  const orderBy = parseOrderByAsObject(errorLogModel, input)

  const [data, totalRows] = await Promise.all([
    db.query.errorLogModel.findMany({
      where,
      ...pagination,
      orderBy,
      with: {
        contact: true,
      },
    }),
    db.$count(errorLogModel, relationsFilterToSQL(errorLogModel, where)),
  ])

  const pageCount = Math.ceil(totalRows / pagination.limit)

  return { data, pageCount }
}
