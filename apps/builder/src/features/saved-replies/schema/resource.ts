import {
  createSelectSchema,
  savedReplyModel,
} from "@openmeerkat/database/schema"
import { z } from "zod"

export const savedReplyResource = createSelectSchema(savedReplyModel, {
  id: z.string(),
  workspaceId: z.string(),
})
export type SavedReplyResource = z.infer<typeof savedReplyResource>
