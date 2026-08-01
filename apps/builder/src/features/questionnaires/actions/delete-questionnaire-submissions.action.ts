"use server"

import { questionnaireSubmissionService } from "@openmeerkat/business"
import { workspaceIdrequestParams } from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import { deleteQuestionnaireSubmissionsRequest } from "../schemas/action"

export const deleteQuestionnaireSubmissionsAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(deleteQuestionnaireSubmissionsRequest)
  .action(async ({ bindArgsParsedInputs: [workspaceId], parsedInput }) => {
    await questionnaireSubmissionService.deleteSubmissions({
      workspaceId,
      questionnaireId: parsedInput.questionnaireId,
      submissionIds: parsedInput.submissionIds,
    })
  })
