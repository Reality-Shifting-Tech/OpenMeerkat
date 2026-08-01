import {
  type SendGridAddContactSchema,
  sendGridAddContactDefaultFn,
  sendGridAddContactSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import SendGridAddContactEditor from "./editor"
import SendGridAddContactViewer from "./viewer"

export const sendGridAddContactStep: StepDefinition<SendGridAddContactSchema> =
  {
    editor: SendGridAddContactEditor,
    viewer: SendGridAddContactViewer,
    validator: sendGridAddContactSchema,
    defaultFn: sendGridAddContactDefaultFn,
  }
