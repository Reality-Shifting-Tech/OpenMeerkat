"use server"

import {
  workspaceMemberCacheTag,
  workspaceMemberService,
} from "@openmeerkat/business"
import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { findOrFail } from "@openmeerkat/database/client"
import { workspaceMemberModel } from "@openmeerkat/database/schema"
import { invalidateCacheByTags } from "@openmeerkat/redis"
import { zodBigintAsString } from "@openmeerkat/utils"
import { hasWorkspacePermission } from "@/lib/auth/permission-routes"
import { getCurrentUserAndTargetWorkspace } from "@/lib/auth/utils"
import { workspaceActionClientAllowExpired } from "@/lib/safe-action"

export const deleteWorkspaceMemberAction = workspaceActionClientAllowExpired
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
    } = props

    const workspaceMember = await findOrFail({
      table: workspaceMemberModel,
      where: { id, workspaceId },
      message: "Workspace member not found",
    })

    if (workspaceMember.role === "owner") {
      throw new OpenMeerkatException(
        "You cannot delete the owner of the workspace",
      )
    }

    const currentUserAndTargetChatbot =
      await getCurrentUserAndTargetWorkspace(workspaceId)
    if (!currentUserAndTargetChatbot) {
      throw new OpenMeerkatException(
        "You are not authorized to delete this workspace member",
      )
    }

    const permissions =
      currentUserAndTargetChatbot.targetWorkspaceMember.permissions
    if (!hasWorkspacePermission(permissions, "superAdmin")) {
      throw new OpenMeerkatException(
        "You are not authorized to delete this workspace member. You need to be a super admin to do this.",
      )
    }

    await workspaceMemberService.delete({ id, workspaceId })

    // The removed member's cached `listByUserId` result still lists this
    // workspace; bust it so their access is revoked immediately.
    await invalidateCacheByTags([
      workspaceMemberCacheTag(workspaceMember.userId),
    ])
  })
