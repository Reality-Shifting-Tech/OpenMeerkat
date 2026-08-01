import { contactService } from "@openmeerkat/business"
import { webhookChannelOrigin } from "@openmeerkat/events/context"
import type { ConditionStepSchema } from "@openmeerkat/flow-config"
import { resolveContactVariablesDeep } from "@openmeerkat/variables"
import {
  IntegrationJobAction,
  integrationQueue,
} from "@openmeerkat/worker-config"
import { logger } from "../../lib/logger"
import { type ExecuteStepProps, seekConnectedNode } from "./flow-utils"

export async function handleCondition(
  props: ExecuteStepProps<ConditionStepSchema>,
): Promise<void> {
  const {
    conversation,
    contactInbox,
    flowVersion,
    step,
    useLatestFlowVersion,
    sendFrom,
    nodeVisits,
    metadata,
    trackingContext,
    commentAnchor,
  } = props

  const resolveMatchedHandleId = async (): Promise<string> => {
    try {
      const resolvedCases = await resolveContactVariablesDeep(
        conversation.contactId,
        step.cases,
        { contactInbox, conversation },
      )

      for (const conditionCase of resolvedCases) {
        if (conditionCase.conditions.length === 0) {
          continue
        }

        const isMatched = await contactService.matchesContactFilter({
          workspaceId: conversation.workspaceId,
          contactId: conversation.contactId,
          contactFilter: {
            operator: conditionCase.operator,
            conditions: conditionCase.conditions,
            // Timezone captured in the editor's browser at save time; the worker
            // has no browser context, so naive date values are interpreted here.
            timezone: conditionCase.timezone,
          },
        })
        if (isMatched) {
          return conditionCase.id
        }
      }
    } catch (error) {
      logger.error(
        { err: error, conversationId: conversation.id, stepId: step.id },
        "[handleCondition] filter evaluation failed; routing to otherwise",
      )
    }

    return step.otherwiseId
  }

  const matchedHandleId = await resolveMatchedHandleId()
  const connectedNodeId = seekConnectedNode(flowVersion, matchedHandleId)
  if (!connectedNodeId) {
    return
  }

  await integrationQueue.add(IntegrationJobAction.sendFlow, {
    type: IntegrationJobAction.sendFlow,
    data: {
      conversationId: conversation.id,
      contactInboxId: contactInbox.id,
      flowId: flowVersion.flowId,
      flowVersionId: useLatestFlowVersion ? undefined : flowVersion.id,
      nodeId: connectedNodeId,
      metadata,
      trackingContext,
      sendFrom,
      nodeVisits,
      commentAnchor,
      origin: webhookChannelOrigin(),
    },
  })
}
