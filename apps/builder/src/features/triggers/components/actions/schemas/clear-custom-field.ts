import { triggerActions } from "@openmeerkat/database/partials"
import { zodBigintAsString } from "@openmeerkat/utils"
import z from "zod"

export const clearCustomField = z.object({
  type: z.literal(triggerActions.enum.clearCustomField),
  customFieldId: zodBigintAsString(),
})
export type ClearCustomField = z.infer<typeof clearCustomField>

export const defaultFn = (): ClearCustomField => ({
  type: triggerActions.enum.clearCustomField,
  customFieldId: "",
})
