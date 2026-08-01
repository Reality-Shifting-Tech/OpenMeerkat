import type { ListInboxesResponse } from "@openmeerkat/business"
import { inboxService, type ListInboxesRequest } from "@openmeerkat/business"

export async function listInboxes(
  input: ListInboxesRequest,
): Promise<ListInboxesResponse> {
  return await inboxService.list(input)
}
