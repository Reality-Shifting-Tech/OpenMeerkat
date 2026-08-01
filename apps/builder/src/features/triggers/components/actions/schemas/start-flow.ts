import { triggerActions } from "@openmeerkat/database/partials"
import { zodBigintAsString } from "@openmeerkat/utils"
import z from "zod"

export const startFlow = z.object({
  type: z.literal(triggerActions.enum.startAnotherFlow),
  flowId: zodBigintAsString(),
})
export type StartFlow = z.infer<typeof startFlow>

export const defaultFn = (): StartFlow => ({
  type: triggerActions.enum.startAnotherFlow,
  flowId: "",
})
