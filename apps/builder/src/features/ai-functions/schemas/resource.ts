import {
  aiFunctionModel,
  createSelectSchema,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils/zod"

export const aiFunctionResource = createSelectSchema(aiFunctionModel, {
  id: zodBigintAsString(),
  workspaceId: zodBigintAsString(),
})
