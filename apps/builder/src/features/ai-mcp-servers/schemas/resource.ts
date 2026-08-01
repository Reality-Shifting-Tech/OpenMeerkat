import { aiMcpServerAuth } from "@openmeerkat/database/partials"
import {
  aiMCPServerModel,
  createSelectSchema,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import { z } from "zod"

export const aiMcpServerResource = createSelectSchema(aiMCPServerModel, {
  id: zodBigintAsString(),
  workspaceId: zodBigintAsString(),
}).extend({
  auth: aiMcpServerAuth,
  availableTools: z.record(z.string(), z.any()),
})
export type AIMcpServerResource = z.infer<typeof aiMcpServerResource>
