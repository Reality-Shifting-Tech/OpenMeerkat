import { botFieldService } from "@openmeerkat/business"
import { rootFolderId } from "@openmeerkat/database/partials"
import { getIdFromParams } from "@openmeerkat/utils"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { BotFieldsTable } from "@/features/bot-fields/bot-field-table"
import { listBotFieldsSearchParams } from "@/features/bot-fields/schemas/query"

export default async function BotFieldsPage(props: {
  params: Promise<{ workspaceId: string }>
  searchParams: Promise<SearchParams>
}) {
  const workspaceId = getIdFromParams(await props.params, "workspaceId")
  if (!workspaceId) {
    return notFound()
  }

  const searchParams = await props.searchParams

  const search = listBotFieldsSearchParams.parse(searchParams)
  const folderId = search.folderId ?? rootFolderId

  const promises = Promise.all([
    botFieldService.list({
      ...search,
      workspaceId,
      folderId,
    }),
  ])

  return (
    <Suspense>
      <BotFieldsTable
        folderId={folderId}
        promises={promises}
        workspaceId={workspaceId}
      />
    </Suspense>
  )
}
