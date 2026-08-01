import {
  createSelectSchema,
  workspaceModel,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import z from "zod"

export const chatbotResource = createSelectSchema(workspaceModel, {
  id: zodBigintAsString(),
})
export type WorkspaceResource = z.infer<typeof chatbotResource>

export const withWorkspaceIdSchema = z.object({
  workspaceId: zodBigintAsString(),
})

export const withWorkspaceIdAndIdSchema = z.object({
  workspaceId: zodBigintAsString(),
  id: zodBigintAsString(),
})
