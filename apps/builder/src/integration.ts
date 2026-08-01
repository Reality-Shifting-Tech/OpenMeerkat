import { integration as integrationActiveCampaign } from "@openmeerkat/integration-active-campaign"
import { integration as integrationDrip } from "@openmeerkat/integration-drip"
import { integration as integrationFacebookAds } from "@openmeerkat/integration-facebook-ads"
import { integration as integrationGetResponse } from "@openmeerkat/integration-get-response"
import { integration as integrationGoogleSheets } from "@openmeerkat/integration-google-sheets"
import { integration as integrationInstagram } from "@openmeerkat/integration-instagram"
import { integration as integrationInstagramFacebook } from "@openmeerkat/integration-instagram-facebook"
import { integration as integrationKlaviyo } from "@openmeerkat/integration-klaviyo"
import { integration as integrationMailchimp } from "@openmeerkat/integration-mailchimp"
import { integration as integrationMailerLite } from "@openmeerkat/integration-mailer-lite"
import { integration as integrationMessenger } from "@openmeerkat/integration-messenger"
import { integration as integrationMoosend } from "@openmeerkat/integration-moosend"
import { integration as integrationOpenmeerkat } from "@openmeerkat/integration-openmeerkat"
import { integration as integrationSendGrid } from "@openmeerkat/integration-sendgrid"
import { integration as integrationSmtp } from "@openmeerkat/integration-smtp"
import { integration as integrationTelegram } from "@openmeerkat/integration-telegram"
import { integration as integrationTiktok } from "@openmeerkat/integration-tiktok"
import { integration as integrationWebchat } from "@openmeerkat/integration-webchat"
import { integration as integrationWhatsapp } from "@openmeerkat/integration-whatsapp"
import { integration as integrationZalo } from "@openmeerkat/integration-zalo"

export const integrations = {
  whatsapp: integrationWhatsapp,
  messenger: integrationMessenger,
  instagram: integrationInstagram,
  instagramFacebook: integrationInstagramFacebook,
  activeCampaign: integrationActiveCampaign,
  drip: integrationDrip,
  getResponse: integrationGetResponse,
  klaviyo: integrationKlaviyo,
  mailchimp: integrationMailchimp,
  mailerLite: integrationMailerLite,
  moosend: integrationMoosend,
  googleSheets: integrationGoogleSheets,
  facebookAds: integrationFacebookAds,
  zalo: integrationZalo,
  telegram: integrationTelegram,
  tiktok: integrationTiktok,
  webchat: integrationWebchat,
  openmeerkat: integrationOpenmeerkat,
  smtp: integrationSmtp,
  sendGrid: integrationSendGrid,
}

export type IntegrationKey = keyof typeof integrations
