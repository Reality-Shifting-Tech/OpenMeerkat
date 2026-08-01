import {
  contactNoteModel,
  createSelectSchema,
} from "@openmeerkat/database/schema"
import { zodBigintAsString } from "@openmeerkat/utils"

export const contactNoteResource = createSelectSchema(contactNoteModel, {
  id: zodBigintAsString(),
  contactId: zodBigintAsString(),
  createdById: zodBigintAsString().nullable(),
})
