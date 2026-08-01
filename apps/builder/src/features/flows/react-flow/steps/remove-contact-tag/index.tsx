import {
  type RemoveContactTagStepSchema,
  removeContactTagStepDefaultFn,
  removeContactTagStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import RemoveContactTagStepEditor from "./editor"
import RemoveContactTagStepViewer from "./viewer"

export const removeContactTagStep: StepDefinition<RemoveContactTagStepSchema> =
  {
    editor: RemoveContactTagStepEditor,
    viewer: RemoveContactTagStepViewer,
    validator: removeContactTagStepSchema,
    defaultFn: removeContactTagStepDefaultFn,
  }
