import {
  type UnassignConversationStepSchema,
  unassignConversationStepDefaultFn,
  unassignConversationStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import UnassignConversationStepEditor from "./editor"
import UnassignConversationStepViewer from "./viewer"

export const unassignConversationStep: StepDefinition<UnassignConversationStepSchema> =
  {
    editor: UnassignConversationStepEditor,
    viewer: UnassignConversationStepViewer,
    validator: unassignConversationStepSchema,
    defaultFn: unassignConversationStepDefaultFn,
  }
