"use client"

import type { AIGenerateTextSchema } from "@openmeerkat/flow-config"
import {
  aiGenerateTextDefaultFn,
  aiGenerateTextSchema,
} from "@openmeerkat/flow-config"
import type { StepDefinition } from "../definition"
import { AIGenerateTextEditor } from "./editor"
import { AIGenerateTextViewer } from "./viewer"

export const aiGenerateTextStep: StepDefinition<AIGenerateTextSchema> = {
  editor: AIGenerateTextEditor,
  viewer: AIGenerateTextViewer,
  validator: aiGenerateTextSchema,
  defaultFn: aiGenerateTextDefaultFn,
}

export default aiGenerateTextStep
