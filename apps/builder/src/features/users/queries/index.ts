import { db } from "@openmeerkat/database/client"
import type { UserModel } from "@openmeerkat/database/types"
import { assertCurrentUserCanAccessChatbot } from "@/lib/auth/utils"
import type { GetUsersSchema } from "../schemas/get-users-schema"

export async function getAllWorkspaceMembers(
  input: GetUsersSchema,
): Promise<{ data: UserModel[] }> {
  await assertCurrentUserCanAccessChatbot(input.workspaceId)

  const where = {
    workspaceMembers: {
      workspaceId: input.workspaceId,
    },
  }

  const data = await db.query.userModel.findMany({ where })

  return { data }
}
