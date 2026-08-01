"use server"

import { db, findOrFail } from "@openmeerkat/database/client"
import { aiTriggerModel } from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"

export const duplicateAITriggerAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
    } = props

    return await duplicateAITrigger({ workspaceId, id })
  })

export const duplicateAITrigger = async (ctx: {
  workspaceId: string
  id: string
}) => {
  const targetAITrigger = await findOrFail({
    table: aiTriggerModel,
    where: {
      id: ctx.id,
      workspaceId: ctx.workspaceId,
    },
    message: "AITrigger not found",
  })
  const { id: eid, name, createdAt, updatedAt, ...rest } = targetAITrigger

  await db.insert(aiTriggerModel).values({
    ...rest,
    name: `${name} _copy`,
  })
}
