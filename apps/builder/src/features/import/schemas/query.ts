import {
  type ImportStatus,
  type ImportType,
  importStatuses,
  importTypes,
} from "@openmeerkat/database/partials"
import { getSortingStateParser } from "@openmeerkat/ui/lib/parsers"
import { zodBigintAsString } from "@openmeerkat/utils"
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import { z } from "zod"
import { basePaginationRequest } from "@/lib/pagination"

export const listImportsRequest = basePaginationRequest.extend({
  workspaceId: zodBigintAsString(),
  type: importTypes.optional(),
  status: importStatuses.optional(),
  keyword: z.string().nullish(),
})
export type ListImportsRequest = z.infer<typeof listImportsRequest>

export const listImportsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  keyword: parseAsString,
  sort: getSortingStateParser<ListImportsItem>().withDefault([
    { id: "createdAt", desc: true },
  ]),
})

export type ListImportsItem = {
  id: string
  workspaceId: string
  userId: string | null
  fileId: string
  fileName: string
  type: ImportType
  status: ImportStatus
  totalCount: number
  processedCount: number
  successCount: number
  failedCount: number
  errorMessage: string | null
  errorSample: Array<{ row: number; reason: string }>
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type ListImportsResponse = {
  data: ListImportsItem[]
  pageCount: number
}
