import { facebookLeadFieldMappingsSchema } from "@openmeerkat/database/partials"
import {
  createSelectSchema,
  facebookLeadAdsAutomationModel,
} from "@openmeerkat/database/schema"
import { z } from "zod"

export const facebookLeadAdsAutomationResource = createSelectSchema(
  facebookLeadAdsAutomationModel,
  {
    id: z.string(),
    workspaceId: z.string(),
    flowId: z.string().nullable(),
    fieldMapping: facebookLeadFieldMappingsSchema,
  },
)
export type FacebookLeadAdsAutomationResource = z.infer<
  typeof facebookLeadAdsAutomationResource
>
