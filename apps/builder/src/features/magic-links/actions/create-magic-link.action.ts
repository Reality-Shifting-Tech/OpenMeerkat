"use server"

import { db, isUniqueViolationError } from "@openmeerkat/database/client"
import { magicLinkModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import { returnValidationErrors } from "next-safe-action"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import {
  type CreateMagicLinkRequest,
  createMagicLinkRequest,
} from "../schemas/action"

export const createMagicLinkAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(createMagicLinkRequest)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    }: {
      bindArgsParsedInputs: WorkspaceIdRequestParams
      parsedInput: CreateMagicLinkRequest
    }) => {
      try {
        await db.insert(magicLinkModel).values({
          id: createId(),
          workspaceId,
          ...parsedInput,
        })
      } catch (error) {
        if (isUniqueViolationError(error)) {
          return returnValidationErrors(createMagicLinkRequest, {
            _errors: ["Validation Exception"],
            name: { _errors: ["Name is already taken"] },
          })
        }

        throw error
      }
    },
  )
