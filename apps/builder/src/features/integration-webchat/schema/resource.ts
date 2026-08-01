import {
  createSelectSchema,
  integrationWebchatModel,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import type { z } from "zod"

export const integrationWebchatResource = createSelectSchema(
  integrationWebchatModel,
  {
    id: zodBigintAsString(),
    inboxId: zodBigintAsString(),
  },
).pick({
  id: true,
  name: true,
})
export type IntegrationWebchatResource = z.infer<
  typeof integrationWebchatResource
>
