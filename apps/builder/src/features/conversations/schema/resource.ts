import {
  conversationModel,
  createSelectSchema,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import z from "zod"
import { contactInboxResource } from "@/features/contact-inboxes/schema/resource"
import { contactResource } from "@/features/contacts/schemas/resource"
import { messageResourceWithRelations } from "@/features/messages/schema/resource"
import { userResource } from "@/features/users/schemas/resource"

export const conversationResource = createSelectSchema(conversationModel, {
  id: z.string(),
  contactId: z.string(),
  workspaceId: z.string(),
})
export type ConversationResource = z.infer<typeof conversationResource>

export const listConversationsItemResource = conversationResource.and(
  z.object({
    contactInboxes: z.array(contactInboxResource),
    messages: z.array(messageResourceWithRelations),
    contact: contactResource.nullable(),
    assignedUser: userResource.nullable(),
  }),
)
export type ListConversationItemResource = z.infer<
  typeof listConversationsItemResource
>

export const listConversationsResponse = z.object({
  data: z.array(listConversationsItemResource),
  nextCursor: z.string().nullable(),
  prevCursor: z.string().nullable(),
})
export type ListConversationsResponse = z.infer<
  typeof listConversationsResponse
>

export const findConversationRequest = z.object({
  id: zodBigintAsString(),
  workspaceId: zodBigintAsString(),
})
export type FindConversationRequest = z.infer<typeof findConversationRequest>

export const findConversationResponse = z.object({
  data: listConversationsItemResource,
})
export type FindConversationResponse = z.infer<typeof findConversationResponse>
