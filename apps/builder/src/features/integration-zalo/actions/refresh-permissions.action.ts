"use server"

import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db, eq, findOrFail } from "@openmeerkat/database/client"
import { integrationZaloModel } from "@openmeerkat/database/schema"
import {
  integration as integrationZalo,
  type ZaloAuthValue,
} from "@openmeerkat/integration-zalo"
import { zodBigintAsString } from "@openmeerkat/utils"
import { logger } from "@/lib/log"
import { workspaceActionClient } from "@/lib/safe-action"

export const refreshZaloPermissionsAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
    } = props

    await refreshZaloPermissions({ workspaceId, id })
  })

const refreshZaloPermissions = async (ctx: {
  workspaceId: string
  id: string
}) => {
  const integrationZaloRow = await findOrFail({
    table: integrationZaloModel,
    where: { id: ctx.id, workspaceId: ctx.workspaceId },
    message: "Integration Zalo not found",
  })

  const auth = integrationZaloRow.auth as ZaloAuthValue

  try {
    if (!integrationZalo.refreshAuth) {
      throw new OpenMeerkatException(
        "Zalo integration does not support refresh",
      )
    }
    const updatedAuth = await integrationZalo.refreshAuth({ auth })

    await db
      .update(integrationZaloModel)
      .set({ auth: updatedAuth })
      .where(eq(integrationZaloModel.id, ctx.id))
  } catch (error) {
    logger.error(error, "Failed to refresh Zalo permissions")
    throw new OpenMeerkatException("Failed to refresh Zalo permissions")
  }
}
