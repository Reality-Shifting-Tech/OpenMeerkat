import { db, relationsFilterToSQL } from "@openmeerkat/database/client"
import { magicLinkModel } from "@openmeerkat/database/schema"
import {
  getPaginationWithDefaults,
  likeContains,
  parseOrderByAsObject,
} from "@openmeerkat/database/utils"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"
import type {
  ListMagicLinksRequest,
  ListMagicLinksResponse,
} from "../schemas/query"

export async function listMagicLinks(
  input: ListMagicLinksRequest,
): Promise<ListMagicLinksResponse> {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)

  const where = {
    workspaceId: input.workspaceId,
    ...(input.keyword
      ? {
          OR: [
            { name: { ilike: likeContains(input.keyword) } },
            { url: { ilike: likeContains(input.keyword) } },
          ],
        }
      : {}),
  }

  const pagination = getPaginationWithDefaults(input)
  const orderBy = parseOrderByAsObject(magicLinkModel, input)

  const [data, totalRows] = await Promise.all([
    db.query.magicLinkModel.findMany({
      where,
      orderBy,
      ...pagination,
    }),
    db.$count(magicLinkModel, relationsFilterToSQL(magicLinkModel, where)),
  ])

  const pageCount = Math.ceil(totalRows / input.perPage)

  return { data, pageCount }
}
