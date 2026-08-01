import { triggerActions } from "@openmeerkat/database/partials"
import { FieldOperationType } from "@openmeerkat/flow-config"
import { zodBigintAsString } from "@openmeerkat/utils"
import z from "zod"

export const setCustomField = z.object({
  type: z.literal(triggerActions.enum.setCustomField),
  customFieldId: zodBigintAsString(),
  operation: z.enum(FieldOperationType),
  value: z.string(),
})
export type SetCustomField = z.infer<typeof setCustomField>

export const defaultFn = (): SetCustomField => ({
  type: triggerActions.enum.setCustomField,
  customFieldId: "",
  operation: FieldOperationType.set,
  value: "",
})
