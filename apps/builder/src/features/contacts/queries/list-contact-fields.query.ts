import { type ContactAccessScope, contactService } from "@openmeerkat/business"
import { notFoundException } from "@openmeerkat/business/errors"
import { db } from "@openmeerkat/database/client"
import type { CustomFieldType } from "@openmeerkat/database/partials"
import type {
  ListContactCustomFieldsRequest,
  ListPublicContactCustomFieldsResponse,
  PublicContactCustomFieldResource,
} from "../schemas/contact-custom-field"

export async function listContactCustomFields(
  input: ListContactCustomFieldsRequest & { accessScope?: ContactAccessScope },
): Promise<ListPublicContactCustomFieldsResponse> {
  if (input.accessScope) {
    await contactService.findByIdOrFail({
      workspaceId: input.workspaceId,
      id: input.contactId,
      accessScope: input.accessScope,
    })
  }

  const data = await db.query.contactCustomFieldModel.findMany({
    where: {
      contactId: input.contactId,
      customField: {
        workspaceId: input.workspaceId,
      },
    },
    with: {
      customField: true,
    },
  })

  return {
    data: data.map((d) => ({
      ...d.customField,
      type: d.customField.type as CustomFieldType,
      value: d.value,
    })),
  }
}

export async function findContactCustomField(input: {
  contactId: string
  customFieldId: string
  workspaceId: string
}): Promise<PublicContactCustomFieldResource> {
  const contactCustomField = await db.query.contactCustomFieldModel.findFirst({
    where: {
      contactId: input.contactId,
      customFieldId: input.customFieldId,
      customField: {
        workspaceId: input.workspaceId,
      },
    },
    with: {
      customField: true,
    },
  })

  if (!contactCustomField) {
    throw notFoundException("Contact custom field not found")
  }
  return {
    ...contactCustomField.customField,
    type: contactCustomField.customField.type as CustomFieldType,
    value: contactCustomField.value,
  }
}
