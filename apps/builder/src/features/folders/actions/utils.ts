import { findOrFail } from "@openmeerkat/database/client"
import type { FolderType } from "@openmeerkat/database/partials"
import { folderModel } from "@openmeerkat/database/schema"

export const ensureFolderIsExists = async (
  id: string,
  workspaceId: string,
  folderType: FolderType,
) => {
  await findOrFail({
    table: folderModel,
    where: {
      workspaceId,
      id,
      folderType,
    },
    message: "Folder does not exists.",
  })
}
