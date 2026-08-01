import { integrationDripService } from "@openmeerkat/business"
import { getIdFromParams } from "@openmeerkat/utils"
import { notFound } from "next/navigation"
import { ManageDrip } from "@/features/integration-drip/components/manage-drip"

export default async function SettingIntegrationDripPage(props: {
  params: Promise<{ workspaceId: string }>
}) {
  const workspaceId = getIdFromParams(await props.params, "workspaceId")
  if (!workspaceId) {
    return notFound()
  }
  const integration =
    await integrationDripService.findByWorkspaceId(workspaceId)
  return (
    <ManageDrip isConnected={Boolean(integration)} workspaceId={workspaceId} />
  )
}
