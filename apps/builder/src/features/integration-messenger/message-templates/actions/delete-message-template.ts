"use server"

import { and, db, eq } from "@openmeerkat/database/client"
import { messengerMessageTemplateModel } from "@openmeerkat/database/schema"
import { invalidateCacheByTags } from "@openmeerkat/redis"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"

export const deleteMessengerMessageTemplateAction = workspaceActionClient
  .bindArgsSchemas([
    zodBigintAsString(),
    zodBigintAsString(),
    zodBigintAsString(),
  ])
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, integrationMessengerId, templateId],
    } = props

    // Verify the integration belongs to the workspace
    const integration = await db.query.integrationMessengerModel.findFirst({
      where: {
        id: integrationMessengerId,
        workspaceId,
      },
      columns: { id: true },
    })

    if (!integration) {
      throw new Error("Messenger integration not found")
    }

    await db
      .delete(messengerMessageTemplateModel)
      .where(
        and(
          eq(messengerMessageTemplateModel.id, templateId),
          eq(
            messengerMessageTemplateModel.integrationMessengerId,
            integrationMessengerId,
          ),
        ),
      )

    await invalidateCacheByTags([
      `workspaces:${workspaceId}#messenger#messageTemplates`,
    ])
  })
