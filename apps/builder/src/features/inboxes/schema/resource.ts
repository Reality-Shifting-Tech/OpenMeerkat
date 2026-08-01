export { inboxResource } from "@openmeerkat/business"

import type {
  InboxModel,
  IntegrationInstagramModel,
  IntegrationMessengerModel,
  IntegrationSmtpModel,
  IntegrationTelegramModel,
  IntegrationWebchatModel,
  IntegrationWhatsappModel,
  IntegrationZaloModel,
} from "@openmeerkat/database/types"

export type InboxResource = InboxModel & {
  integrationWhatsapp?: IntegrationWhatsappModel
  integrationWebchat?: IntegrationWebchatModel
  integrationMessenger?: IntegrationMessengerModel
  integrationInstagram?: IntegrationInstagramModel
  integrationZalo?: IntegrationZaloModel
  integrationTelegram?: IntegrationTelegramModel
  integrationSmtp?: IntegrationSmtpModel
}
