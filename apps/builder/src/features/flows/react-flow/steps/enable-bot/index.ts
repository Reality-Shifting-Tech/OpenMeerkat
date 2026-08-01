import {
  type EnableBotStepSchema,
  enableBotStepDefaultFn,
  enableBotStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import EnableBotStepEditor from "./editor"
import EnableBotStepViewer from "./viewer"

export const enableBotStep: StepDefinition<EnableBotStepSchema> = {
  editor: EnableBotStepEditor,
  viewer: EnableBotStepViewer,
  validator: enableBotStepSchema,
  defaultFn: enableBotStepDefaultFn,
}
