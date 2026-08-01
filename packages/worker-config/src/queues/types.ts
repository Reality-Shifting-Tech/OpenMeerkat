import type { TrackingResponseType } from "@openmeerkat/analytics"

export interface BotResponseTrackingContext {
  aiProvider: string
  conversationId: string
  messageId: string
  responseType: TrackingResponseType
  startTime: number
  triggerType: string
  workspaceId: string
}
