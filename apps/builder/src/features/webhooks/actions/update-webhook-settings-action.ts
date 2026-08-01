"use server"

import { db, eq } from "@openmeerkat/database/client"
import { webhookModel } from "@openmeerkat/database/schema"
import { updateWebhookCache } from "@openmeerkat/events"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"
import { updateWebhookSettingsRequest } from "../schemas/update-webhook-schema"

export const updateWebhookSettingsAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(updateWebhookSettingsRequest)
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, id],
      parsedInput,
    } = props

    const webhook = await db.query.webhookModel.findFirst({
      where: {
        id,
        workspaceId,
      },
    })

    if (!webhook) {
      throw new Error("Webhook not found")
    }

    await db
      .update(webhookModel)
      .set(parsedInput)
      .where(eq(webhookModel.id, webhook.id))

    await updateWebhookCache(workspaceId)
  })
