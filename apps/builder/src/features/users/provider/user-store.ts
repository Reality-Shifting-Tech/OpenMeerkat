import ky, { HTTPError } from "ky"
import { createStore } from "zustand/vanilla"
import type { ListWorkspaceMembersResponse } from "@/features/workspace-members/schema/query"
import { maxPerPageString } from "@/lib/shared-request"

export type UserState = {
  loadingWorkspaceMembers: boolean
  error: string | null
  initialized: boolean

  workspaceId: string
  workspaceMembers: ListWorkspaceMembersResponse["data"]
}

export type UserActions = {
  initializeAgents: () => Promise<void>
  getAllWorkspaceMembers: () => Promise<void>
}

export type UserStore = UserState & UserActions

export const createUserStore = (props: Partial<UserState>) =>
  createStore<UserStore>((set, get) => ({
    loadingWorkspaceMembers: false,
    error: null,
    initialized: false,

    workspaceId: "",
    workspaceMembers: [],
    ...props,

    initializeAgents: async () => {
      const { initialized } = get()

      if (initialized) {
        return
      }

      try {
        await get().getAllWorkspaceMembers()
      } catch (error: unknown) {
        set({
          error:
            error instanceof HTTPError
              ? error.message
              : "Failed to fetch agents",
        })
      } finally {
        set({ initialized: true })
      }
    },

    getAllWorkspaceMembers: async () => {
      const { workspaceId, loadingWorkspaceMembers } = get()

      if (loadingWorkspaceMembers || !workspaceId) {
        return
      }

      set({ loadingWorkspaceMembers: true, error: null })

      try {
        const searchParams = new URLSearchParams({
          perPage: maxPerPageString,
        })
        const { data } = await ky
          .get<ListWorkspaceMembersResponse>(
            `/api/workspaces/${workspaceId}/members?${searchParams.toString()}`,
          )
          .json()

        set({ workspaceMembers: data })
      } catch (error: unknown) {
        set({
          error:
            error instanceof HTTPError
              ? error.message
              : "Failed to fetch workspace members",
        })
      } finally {
        set({ loadingWorkspaceMembers: false })
      }
    },
  }))
