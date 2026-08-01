"use server"

import { and, db, eq, findOrFail } from "@openmeerkat/database/client"
import { sequenceModel } from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"

export const deleteSequenceAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
    } = props

    await deleteSequence({ workspaceId, id })
  })

export const deleteSequence = async (ctx: {
  workspaceId: string
  id: string
}) => {
  await findOrFail({
    table: sequenceModel,
    where: {
      id: ctx.id,
      workspaceId: ctx.workspaceId,
    },
    message: "Sequence not found",
  })

  await db.delete(sequenceModel).where(and(eq(sequenceModel.id, ctx.id)))
}
