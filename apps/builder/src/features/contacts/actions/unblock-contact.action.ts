"use server"

import { type ContactAccessScope, contactService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import { requireContactPermissionScope } from "../permissions"

export const unblockContactAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
    } = props
    const accessScope = await requireContactPermissionScope(workspaceId)

    await unblockContact({ workspaceId, id, accessScope })
  })

export const unblockContact = async (ctx: {
  workspaceId: string
  id: string
  accessScope?: ContactAccessScope
}) => {
  await contactService.unblock(ctx)
}
