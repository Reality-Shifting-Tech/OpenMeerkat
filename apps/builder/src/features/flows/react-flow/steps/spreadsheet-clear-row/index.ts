import {
  type SpreadsheetClearRowSchema,
  spreadsheetClearRowDefaultFn,
  spreadsheetClearRowSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import { SpreadsheetViewer } from "../spreadsheet/viewer"
import { SpreadsheetClearRowEditor } from "./editor"

export const spreadsheetClearRowStep: StepDefinition<SpreadsheetClearRowSchema> =
  {
    editor: SpreadsheetClearRowEditor,
    viewer: SpreadsheetViewer,
    validator: spreadsheetClearRowSchema,
    defaultFn: spreadsheetClearRowDefaultFn,
  }
