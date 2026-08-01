"use server"

import { flowService } from "@openmeerkat/business"
import { zodBigintAsString } from "@openmeerkat/utils"
import { workspaceActionClient } from "@/lib/safe-action"

export const duplicateFlowAction = workspaceActionClient
  .bindArgsSchemas([zodBigintAsString(), zodBigintAsString()])
  .action(({ bindArgsParsedInputs: [workspaceId, id] }) =>
    flowService.duplicate({ workspaceId, id }),
  )
