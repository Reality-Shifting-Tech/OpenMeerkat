import { findOrFail } from "@openmeerkat/database/client"
import { integrationWhatsappModel } from "@openmeerkat/database/schema"
import type { WhatsappAuthValue } from "@openmeerkat/integration-whatsapp"
import {
  type ConversationalAutomation,
  findConversationalAutomation,
} from "@openmeerkat/integration-whatsapp/api/phone-number"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"
import type { ListWhatsappPhoneNumberAutomation } from "../schemas/get-ice-breakers-schema"

export const findWhatsappAutomation = async (
  input: ListWhatsappPhoneNumberAutomation,
): Promise<ConversationalAutomation> => {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)

  const integrationWhatsapp = await findOrFail({
    table: integrationWhatsappModel,
    where: {
      workspaceId: input.workspaceId,
      id: input.id,
    },
    message: "Whatsapp integration not found",
  })

  return await findConversationalAutomation(
    integrationWhatsapp.auth as WhatsappAuthValue,
  )
}
