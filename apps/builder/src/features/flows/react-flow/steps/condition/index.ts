import {
  type ConditionStepSchema,
  conditionStepDefaultFn,
  conditionStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import ConditionStepEditor from "./editor"
import ConditionStepViewer from "./viewer"

export const conditionStep: StepDefinition<ConditionStepSchema> = {
  editor: ConditionStepEditor,
  viewer: ConditionStepViewer,
  validator: conditionStepSchema,
  defaultFn: conditionStepDefaultFn,
}
