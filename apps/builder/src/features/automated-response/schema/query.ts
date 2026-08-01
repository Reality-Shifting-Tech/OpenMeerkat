import type { AutomatedResponseModel } from "@openmeerkat/database/types"
import { getSortingStateParser } from "@openmeerkat/ui/lib/parsers"
import { zodBigintAsString } from "@openmeerkat/utils"
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import { z } from "zod"
import { parseAsBigInt } from "@/lib/nuqs"

export const listAutomatedResponsesSearchParams = createSearchParamsCache({
  folderId: parseAsBigInt,
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  keyword: parseAsString,
  sort: getSortingStateParser<AutomatedResponseModel>().withDefault([
    { id: "createdAt", desc: true },
  ]),
})

export type ListAutomatedResponsesRequest = Awaited<
  ReturnType<typeof listAutomatedResponsesSearchParams.parse>
> & { workspaceId: string }

export const findAutomatedResponseRequest = z.object({
  workspaceId: zodBigintAsString(),
  id: zodBigintAsString(),
})
export type FindAutomatedResponseRequest = z.infer<
  typeof findAutomatedResponseRequest
>
