import { aiAgentModel, createSelectSchema } from "@openmeerkat/database/schema"
import { z } from "zod"

export const aiAgentResourceSchema = createSelectSchema(aiAgentModel, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
