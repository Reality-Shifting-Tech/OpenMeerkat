import { questionnaireService } from "@openmeerkat/business"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"

export async function getQuestionnaire(input: {
  workspaceId: string
  id: string
}) {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)
  return await questionnaireService.getForEdit(input)
}
