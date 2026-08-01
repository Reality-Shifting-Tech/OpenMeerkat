import { customAuthSchema } from "@openmeerkat/sdk"
import { z } from "zod"

export const openmeerkatAuthSchema = customAuthSchema.extend({
  appUrl: z.url(),
  wsUrl: z.url(),
  apiKey: z.string().trim().min(1),
})
export type OpenmeerkatAuthValue = z.infer<typeof openmeerkatAuthSchema>
