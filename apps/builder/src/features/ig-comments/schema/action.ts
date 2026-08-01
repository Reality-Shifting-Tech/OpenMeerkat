import {
  fbCommentHideCommentsSchema,
  fbCommentIncludeKeywordsSchema,
  fbCommentOptionsSchema,
  fbCommentPostSchema,
  fbCommentReplyAfterSchema,
  fbCommentReplySchema,
  igCommentAutomationTypes,
} from "@openmeerkat/database/partials"
import type { FBCommentAutomationModel } from "@openmeerkat/database/types"
import { getSortingStateParser } from "@openmeerkat/ui/lib/parsers"
import { zodBigintAsString } from "@openmeerkat/utils"
import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import z from "zod"
import { parseAsBigInt } from "@/lib/nuqs"
import { basePaginationRequest } from "@/lib/pagination"
import { igCommentResource } from "./resource"

export const listIgCommentsRequest = basePaginationRequest.and(
  z.object({
    workspaceId: zodBigintAsString(),
    name: z.string().nullish(),
    folderId: zodBigintAsString().nullish(),
    isActive: z.boolean().nullish(),
  }),
)
export type ListIgCommentsRequest = z.infer<typeof listIgCommentsRequest>

export const listIgCommentsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString.withDefault(""),
  isActive: parseAsBoolean,
  folderId: parseAsBigInt,
  sort: getSortingStateParser<FBCommentAutomationModel>().withDefault([
    { id: "createdAt", desc: true },
  ]),
})

export const listIgCommentsResponse = z.object({
  data: z.array(igCommentResource),
  pageCount: z.number(),
})
export type ListIgCommentsResponse = z.infer<typeof listIgCommentsResponse>

export const igCommentVariants = igCommentAutomationTypes
export type IgCommentVariant = z.infer<typeof igCommentVariants>

export const createIgCommentRequest = z.object({
  name: z.string().trim().min(1).max(255),
  type: igCommentVariants,
  folderId: zodBigintAsString().nullish(),
  post: fbCommentPostSchema,
  privateReply: fbCommentReplySchema,
  publicReply: fbCommentReplySchema,
  includeKeywords: fbCommentIncludeKeywordsSchema,
  excludeKeywords: z.array(z.string()),
  options: fbCommentOptionsSchema,
  hideComments: fbCommentHideCommentsSchema,
  replyAfter: fbCommentReplyAfterSchema,
})
export type CreateIgCommentRequest = z.infer<typeof createIgCommentRequest>

export const updateIgCommentRequest = createIgCommentRequest.partial().and(
  z.object({
    isActive: z.boolean().optional(),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
  }),
)
export type UpdateIgCommentRequest = z.infer<typeof updateIgCommentRequest>
