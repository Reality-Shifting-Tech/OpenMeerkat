import {
  type CountCharactersStepSchema,
  countCharactersStepDefaultFn,
  countCharactersStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import CountCharactersStepEditor from "./editor"
import CountCharactersStepViewer from "./viewer"

export const countCharactersStep: StepDefinition<CountCharactersStepSchema> = {
  editor: CountCharactersStepEditor,
  viewer: CountCharactersStepViewer,
  validator: countCharactersStepSchema,
  defaultFn: countCharactersStepDefaultFn,
}
