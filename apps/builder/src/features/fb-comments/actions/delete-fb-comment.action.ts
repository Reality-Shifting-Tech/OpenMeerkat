"use server"

import { and, db, eq, findOrFail } from "@openmeerkat/database/client"
import { fbCommentAutomationModel } from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"

export const deleteFbCommentAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
    } = props

    await deleteFbComment({ workspaceId, id })
  })

export const deleteFbComment = async (ctx: {
  workspaceId: string
  id: string
}) => {
  await findOrFail({
    table: fbCommentAutomationModel,
    where: { id: ctx.id, workspaceId: ctx.workspaceId },
    message: "FB Comment Automation not found",
  })

  await db
    .delete(fbCommentAutomationModel)
    .where(and(eq(fbCommentAutomationModel.id, ctx.id)))
}
