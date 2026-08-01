import {
  createSelectSchema,
  integrationWhatsappModel,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import { z } from "zod"

export const integrationWhatsappResource = createSelectSchema(
  integrationWhatsappModel,
  {
    id: zodBigintAsString(),
    inboxId: zodBigintAsString(),
  },
).pick({
  id: true,
  name: true,
  inboxId: true,
  displayPhoneNumber: true,
})

export type IntegrationWhatsappResource = z.infer<
  typeof integrationWhatsappResource
>

export const listIntegrationWhatsappsResponse = z.array(
  integrationWhatsappResource,
)
export type ListIntegrationWhatsappResponse = z.infer<
  typeof listIntegrationWhatsappsResponse
>
