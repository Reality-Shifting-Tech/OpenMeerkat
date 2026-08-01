import {
  type WhatsappFlowStepSchema,
  whatsappFlowStepDefaultFn,
  whatsappFlowStepSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import WhatsappFlowStepEditor from "./editor"
import WhatsappFlowStepViewer from "./viewer"

const whatsappFlowStep: StepDefinition<WhatsappFlowStepSchema> = {
  editor: WhatsappFlowStepEditor,
  viewer: WhatsappFlowStepViewer,
  validator: whatsappFlowStepSchema,
  defaultFn: whatsappFlowStepDefaultFn,
}

export default whatsappFlowStep
