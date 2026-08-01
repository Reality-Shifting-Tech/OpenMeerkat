import { withBlockedOwnerGuard } from "@openmeerkat/business"

export async function isBlockedWorkspace(
  workspaceId: string | undefined,
): Promise<boolean> {
  // The guard returns undefined when blocked; the true sentinel identifies an allowed workspace.
  return (
    (await withBlockedOwnerGuard(workspaceId, async () => true)) === undefined
  )
}
