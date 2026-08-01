"use server"

import { db } from "@openmeerkat/database/client"
import { spreadsheetModel } from "@openmeerkat/database/schema"
import { createId } from "@openmeerkat/utils"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import {
  type CreateSpreadsheetRequest,
  createSpreadsheetRequest,
} from "../schema/mutation"
import { verifyGoogleSheetsUrl } from "./util"

export const createSpreadsheetAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(createSpreadsheetRequest)
  .action(
    async ({
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    }: {
      bindArgsParsedInputs: WorkspaceIdRequestParams
      parsedInput: CreateSpreadsheetRequest
    }) => {
      const spreadsheetId = await verifyGoogleSheetsUrl(
        workspaceId,
        parsedInput.url,
      )

      await db.insert(spreadsheetModel).values({
        ...parsedInput,
        id: createId(),
        workspaceId,
        spreadsheetId,
      })
    },
  )
