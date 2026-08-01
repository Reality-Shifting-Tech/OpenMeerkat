import type { AutomatedResponseModel } from "@openmeerkat/database/types"
import type { FlowResource } from "@/features/flows/schemas/resource"

export type AutomatedResponseResource = AutomatedResponseModel & {
  flow?: FlowResource
}
