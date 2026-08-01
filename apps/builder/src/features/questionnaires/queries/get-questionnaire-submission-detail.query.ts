import { questionnaireSubmissionService } from "@openmeerkat/business"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"

export async function getQuestionnaireSubmissionDetail(input: {
  workspaceId: string
  questionnaireId: string
  submissionId: string
}) {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)
  return await questionnaireSubmissionService.detail(input)
}
