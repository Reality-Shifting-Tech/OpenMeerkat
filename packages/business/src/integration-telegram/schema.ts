import {
  createSelectSchema,
  integrationTelegramModel,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import type { z } from "zod"

export const integrationTelegramResource = createSelectSchema(
  integrationTelegramModel,
  {
    id: zodBigintAsString(),
    inboxId: zodBigintAsString(),
    workspaceId: zodBigintAsString(),
  },
)

export type IntegrationTelegramResource = z.infer<
  typeof integrationTelegramResource
>
