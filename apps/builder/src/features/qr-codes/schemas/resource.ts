import { qrStyles, reflinkTypes } from "@openmeerkat/database/partials"
import { createSelectSchema, reflinkModel } from "@openmeerkat/database/schema"
import { z } from "zod"

export const qrCodeResource = createSelectSchema(reflinkModel, {
  id: z.string(),
  flowId: z.string(),
  customFieldId: z.string().nullable(),
  workspaceId: z.string(),
  type: reflinkTypes,
  qrStyles: qrStyles.nullable(),
})
export type QrCodeResource = z.infer<typeof qrCodeResource>
