"use client"

import type { AIEditImageSchema } from "@openmeerkat/flow-config"
import {
  aiEditImageDefaultFn,
  aiEditImageSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import { AIEditImageEditor } from "./editor"
import { AIEditImageViewer } from "./viewer"

export const aiEditImageStep: StepDefinition<AIEditImageSchema> = {
  editor: AIEditImageEditor,
  viewer: AIEditImageViewer,
  validator: aiEditImageSchema,
  defaultFn: aiEditImageDefaultFn,
}

export default aiEditImageStep
