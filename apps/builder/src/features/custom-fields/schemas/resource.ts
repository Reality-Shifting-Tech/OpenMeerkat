import {
  createSelectSchema,
  customFieldModel,
} from "@openmeerkat/database/schema"
import { z } from "zod"

export const customFieldResource = createSelectSchema(customFieldModel, {
  id: z.string(),
  workspaceId: z.string(),
  folderId: z.string().nullable(),
  // type: z.string(),
})
export type CustomFieldResource = z.infer<typeof customFieldResource>

export const publicCustomFieldResource = customFieldResource.pick({
  id: true,
  name: true,
  type: true,
  description: true,
})
