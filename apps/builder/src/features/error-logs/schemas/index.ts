import type { ErrorLogModel } from "@openmeerkat/database/types"
import type { ContactResource } from "@/features/contacts/schemas/resource"

export type ErrorLogResource = ErrorLogModel & {
  contact?: ContactResource | null
}
