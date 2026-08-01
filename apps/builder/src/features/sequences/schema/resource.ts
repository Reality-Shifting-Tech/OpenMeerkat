import { createSelectSchema, sequenceModel } from "@openmeerkat/database/schema"
import z from "zod"

export const sequenceResource = createSelectSchema(sequenceModel, {
  id: z.string(),
  workspaceId: z.string(),
  folderId: z.string().nullable(),
})
export type SequenceResource = typeof sequenceModel.$inferSelect
