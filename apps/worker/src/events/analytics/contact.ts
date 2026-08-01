import { contactAnalyticsService } from "@openmeerkat/analytics"
import type {
  ContactBlockedEventPayload,
  ContactCreatedEventPayload,
  ContactDeletedEventPayload,
} from "@openmeerkat/event-bus"

export function handleContactCreated(
  payloads: ContactCreatedEventPayload[],
): Promise<void> {
  return contactAnalyticsService.recordEvents(payloads, "contact_created")
}

export function handleContactDeleted(
  payloads: ContactDeletedEventPayload[],
): Promise<void> {
  return contactAnalyticsService.recordEvents(payloads, "contact_deleted")
}

export function handleContactBlocked(
  payloads: ContactBlockedEventPayload[],
): Promise<void> {
  return contactAnalyticsService.recordEvents(payloads, "contact_blocked")
}
