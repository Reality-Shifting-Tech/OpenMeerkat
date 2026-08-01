import {
  type SetMessengerUserPersistentMenuStepSchema,
  setMessengerUserPersistentMenuStepDefaultFn,
  setMessengerUserPersistentMenuStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import SetMessengerUserPersistentMenuStepEditor from "./editor"
import SetMessengerUserPersistentMenuStepViewer from "./viewer"

export const setMessengerUserPersistentMenuStep: StepDefinition<SetMessengerUserPersistentMenuStepSchema> =
  {
    editor: SetMessengerUserPersistentMenuStepEditor,
    viewer: SetMessengerUserPersistentMenuStepViewer,
    validator: setMessengerUserPersistentMenuStepSchema,
    defaultFn: setMessengerUserPersistentMenuStepDefaultFn,
  }
