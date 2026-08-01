"use client"

import { ReflinkAnalytics } from "@openmeerkat/analytics-nextjs/components/reflink-analytics"

export function ReflinkAnalyticsClient({
  workspaceId,
  linkId,
  linkName,
}: {
  workspaceId: string
  linkId: string
  linkName: string
}) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return (
    <ReflinkAnalytics
      defaultSearchParams={{ workspaceId, linkId, timezone, linkName }}
    />
  )
}
