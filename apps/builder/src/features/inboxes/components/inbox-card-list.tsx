"use client"

import type { ListInboxesResponse } from "@openmeerkat/business"
import { buildInboxLink } from "@openmeerkat/business/utils"
import type { ChannelType } from "@openmeerkat/database/partials"
import type { InboxWithIntegrations } from "@openmeerkat/database/types"
import { Card, CardContent } from "@openmeerkat/ui/components/ui/card"
import { useTranslations } from "next-intl"
import { memo } from "react"
import { ScanQRCodeDialog } from "@/features/qr-codes/scan-qrcode"
import { useTenantSettings } from "@/features/tenant"
import { InboxIcon } from "./inbox-icon"
import InboxNewCard from "./inbox-new-card"

type InboxCardListProps = {
  workspaceId: string
  allowAddNew?: boolean
  blocked?: boolean
  /** Why creation is blocked; picks the create-card copy. Defaults to the plan/trial message. */
  reason?: "status" | "mac" | null
  inboxes: ListInboxesResponse["data"]
}

export function InboxCardList({
  workspaceId,
  allowAddNew = true,
  blocked = false,
  reason,
  inboxes,
}: InboxCardListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {inboxes.map((inbox) => (
        <BaseInboxCard inbox={inbox} key={inbox.id} />
      ))}

      {allowAddNew && (
        <InboxNewCard
          blocked={blocked}
          reason={reason}
          workspaceId={workspaceId}
        />
      )}
    </div>
  )
}

const BaseInboxCard = memo(function BaseInboxCard({
  inbox,
}: {
  inbox: ListInboxesResponse["data"][number]
}) {
  const t = useTranslations()
  const { appUrl } = useTenantSettings()
  const link = buildInboxLink(appUrl, inbox as InboxWithIntegrations)

  if (!link) {
    return
  }

  return (
    <Card className="py-3">
      <CardContent className="flex flex-wrap items-center justify-between gap-2 px-4">
        <InboxIcon channel={inbox.channel as ChannelType} label={inbox.name} />

        <ScanQRCodeDialog
          link={link}
          title={t("actions.connectFeature", {
            feature: inbox.name,
          })}
          triggerName={t("actions.testNow")}
        />
      </CardContent>
    </Card>
  )
})
