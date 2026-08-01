"use server"

import { db, eq, findOrFail } from "@openmeerkat/database/client"
import { broadcastModel } from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import {
  type UpdateBroadcastSchema,
  updateBroadcastSchema,
} from "../schemas/action"

export const updateBroadcastAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(updateBroadcastSchema)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
      parsedInput,
    } = props

    return await updateBroadcast({ workspaceId, id }, parsedInput)
  })

export const updateBroadcast = async (
  ctx: { workspaceId: string; id: string },
  parsedInput: UpdateBroadcastSchema,
) => {
  const broadcast = await findOrFail({
    table: broadcastModel,
    where: {
      id: ctx.id,
      workspaceId: ctx.workspaceId,
    },
  })

  await db
    .update(broadcastModel)
    .set(parsedInput)
    .where(eq(broadcastModel.id, broadcast.id))
}
