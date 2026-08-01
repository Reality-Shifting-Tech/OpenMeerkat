"use server"

import { workspaceService } from "@openmeerkat/business"
import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { findOrFail } from "@openmeerkat/database/client"
import { invitationModel, userModel } from "@openmeerkat/database/schema"
import type { WorkspaceModel } from "@openmeerkat/database/types"

export async function findInvitation({ code }: { code: string }) {
  const invitation = await findOrFail({
    table: invitationModel,
    where: {
      code,
    },
    message: "Invitation not found",
  })
  if (invitation.expiresAt < new Date()) {
    throw new OpenMeerkatException("Invitation expired")
  }

  const user = await findOrFail({
    table: userModel,
    where: {
      id: invitation.invitedBy,
    },
    message: "User not found",
  })

  let workspace: WorkspaceModel | null = null
  if (invitation.workspaceId) {
    workspace =
      (await workspaceService.find({
        where: { id: invitation.workspaceId },
      })) ?? null
  }

  return {
    invitation,
    user,
    workspace,
  }
}
