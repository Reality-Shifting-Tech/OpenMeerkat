import type { CustomFieldType } from "@openmeerkat/database/partials"
import type {
  ContactInboxModel,
  ContactModel,
  ConversationModel,
  WorkspaceModel,
} from "@openmeerkat/database/types"

export type ContactCustomFieldValue = {
  key: string
  type: CustomFieldType
  value: string
  description: string
}

export type ContactVariableContext = {
  contact: ContactModel
  contactInbox: ContactInboxModel | null
  conversation?: ConversationModel | null
  workspace: WorkspaceModel | null
}

export type ReplaceVariableProps = ContactVariableContext & {
  customFieldsMap: Map<string, ContactCustomFieldValue>
}
