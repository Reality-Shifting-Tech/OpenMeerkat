import {
  baseNodeDataSchema,
  conditionNodeSchema,
  conditionStepSchema,
} from "@openmeerkat/flow-config"
import { zodBigintAsString } from "@openmeerkat/utils"
import { z } from "zod"
import { contactFilterCriteriaSchema } from "@/features/contact-filter/schemas"

const conditionCaseEditorSchema = contactFilterCriteriaSchema.extend({
  id: zodBigintAsString(),
})

const conditionStepEditorSchema = conditionStepSchema.extend({
  cases: z.array(conditionCaseEditorSchema).min(1),
})

export const conditionNodeEditorSchema = conditionNodeSchema.extend({
  data: baseNodeDataSchema.extend({
    details: z.object({
      steps: z.array(conditionStepEditorSchema).min(1).max(1),
    }),
  }),
})
