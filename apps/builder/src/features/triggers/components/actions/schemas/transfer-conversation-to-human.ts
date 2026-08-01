import { triggerActions } from "@openmeerkat/database/partials"
import z from "zod"

export const transferConversationToHuman = z.object({
  type: z.literal(triggerActions.enum.transferConversationToHuman),
  notifyAdmins: z.boolean(),
})
export type TransferConversationToHuman = z.infer<
  typeof transferConversationToHuman
>

export const defaultFn = (): TransferConversationToHuman => ({
  type: triggerActions.enum.transferConversationToHuman,
  notifyAdmins: true,
})
