import {
  type FollowUpStepSchema,
  followUpStepDefaultFn,
  followUpStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import FollowUpStepEditor from "./editor"
import FollowUpStepViewer from "./viewer"

export const followUpStep: StepDefinition<FollowUpStepSchema> = {
  editor: FollowUpStepEditor,
  viewer: FollowUpStepViewer,
  validator: followUpStepSchema,
  defaultFn: followUpStepDefaultFn,
}
