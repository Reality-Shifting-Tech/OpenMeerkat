import { botMessageAnalyticsService } from "@openmeerkat/analytics"
import type { MessageBotReceivedEventPayload } from "@openmeerkat/event-bus"

export function handleMessageBotReceived(
  payloads: MessageBotReceivedEventPayload[],
): Promise<void> {
  return botMessageAnalyticsService.recordEvents(payloads)
}
