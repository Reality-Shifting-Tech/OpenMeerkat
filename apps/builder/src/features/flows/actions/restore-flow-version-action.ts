"use server"

import { flowVersionService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import z from "zod"
import { workspaceActionClient } from "@/lib/safe-action"

export const restoreFlowVersionAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .inputSchema(z.object({ versionId: zodBigintAsString() }))
  .action(async (props) => {
    const {
      bindArgsParsedInputs: [workspaceId, flowId],
      parsedInput: { versionId },
    } = props

    const version = await flowVersionService.findById({
      versionId,
      flowId,
      workspaceId,
    })

    await flowVersionService.restore({ version })

    return { nodes: version.nodes, edges: version.edges }
  })
