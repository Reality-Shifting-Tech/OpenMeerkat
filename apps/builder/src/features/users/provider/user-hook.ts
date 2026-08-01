import type { SelectOption } from "@openmeerkat/ui/components/form/select-field"
import type { MultiSelectGroup } from "@openmeerkat/ui/components/ui/sersavan/multi-select"
import { useMemo } from "react"
import { useUserStore } from "./user-store-context"

export const useContactAssigneeOptions = (props?: {
  autoGroup?: boolean
  includeAll?: boolean
  includeUnassigned?: boolean
}): SelectOption[] => {
  const {
    autoGroup = true,
    includeAll = false,
    includeUnassigned = false,
  } = props || {}

  const { workspaceMembers } = useUserStore((state) => state)

  return useMemo(() => {
    const result: SelectOption[] = [
      {
        label: "Agents",
        value: "agents",
        children: workspaceMembers.map((v) => ({
          label: v.user?.name ?? "--",
          value: `u_${v.user?.id}`,
        })),
      },
    ]

    if (includeUnassigned) {
      result.unshift({
        label: "Unassigned",
        value: "unassigned",
      })
    }

    if (includeAll) {
      result.unshift({
        label: "All",
        value: "all",
      })
    }
    if (autoGroup) {
      return result
    }

    return result
      .flatMap((v) => v.children ?? [])
      .filter(Boolean) as SelectOption[]
  }, [workspaceMembers, autoGroup, includeAll, includeUnassigned])
}

export const useContactAssigneeMultiSelectOptions = (): MultiSelectGroup[] => {
  const { workspaceMembers } = useUserStore((state) => state)

  return useMemo(
    () => [
      {
        heading: "Agents",
        options: workspaceMembers.map((v) => ({
          label: v.user?.name ?? "--",
          value: `u_${v.user?.id}`,
        })),
      },
    ],
    [workspaceMembers],
  )
}
