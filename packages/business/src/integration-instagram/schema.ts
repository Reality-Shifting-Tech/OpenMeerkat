import {
  createSelectSchema,
  integrationInstagramModel,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import type { z } from "zod"

export const integrationInstagramResource = createSelectSchema(
  integrationInstagramModel,
  {
    id: zodBigintAsString(),
    inboxId: zodBigintAsString(),
  },
).pick({
  id: true,
  name: true,
  inboxId: true,
  username: true,
})

export type IntegrationInstagramResource = z.infer<
  typeof integrationInstagramResource
>
