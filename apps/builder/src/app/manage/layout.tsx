import { tenantService } from "@openmeerkat/business"
import { notFound } from "next/navigation"
import { isCloud } from "@/env"
import { ManageLayout } from "@/features/manage/manage-layout"
import { enforcePasswordCurrent } from "@/lib/auth/require-password-current"
import { getCurrentUser } from "@/lib/auth/utils"

export default async function ManageLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    return notFound()
  }

  enforcePasswordCurrent(user)

  // Cloud edition: only the active tenant owner (reseller) may access manage.
  if (!isCloud()) {
    return notFound()
  }

  const tenant = await tenantService.findByOwner(user.id)
  if (tenant?.status !== "active") {
    return notFound()
  }

  return <ManageLayout sidebar={null}>{children}</ManageLayout>
}
