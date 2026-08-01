import {
  broadcastModel,
  createSelectSchema,
} from "@openmeerkat/database/schema"
import type { BroadcastModel, FlowModel } from "@openmeerkat/database/types"

export const broadcastResource = createSelectSchema(broadcastModel)
export type BroadcastResource = BroadcastModel

export type BroadcastResourceWithRelations = BroadcastResource & {
  flow?: Pick<FlowModel, "id" | "name"> | null
  contactsCount?: number
}

export const publicBroadcastResource = createSelectSchema(broadcastModel).pick({
  id: true,
  name: true,
  status: true,
  schedulesType: true,
  schedulesAt: true,
  flowId: true,
  contactCount: true,
})
