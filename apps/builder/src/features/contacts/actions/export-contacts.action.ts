"use server"

import { OpenMeerkatException } from "@openmeerkat/business/errors"
import { db } from "@openmeerkat/database/client"
import {
  exportSubTypes,
  fileContextTypes,
  fileStatuses,
} from "@openmeerkat/database/partials"
import { fileModel } from "@openmeerkat/database/schema"
import type { UserModel } from "@openmeerkat/database/types"
import { createId } from "@openmeerkat/utils"
import { DefaultJobAction, defaultQueue } from "@openmeerkat/worker-config"
import { stripContactPIIFields } from "@openmeerkat/worker-config/contact-pii"
import {
  type WorkspaceIdRequestParams,
  workspaceIdrequestParams,
} from "@/features/common/schemas"
import { workspaceActionClient } from "@/lib/safe-action"
import { resolveContactPermissionScope } from "../permissions"
import {
  type ExportContactsRequest,
  type ExportContactsResponse,
  exportContactsRequest,
} from "../schemas/action"

export const exportContactsAction = workspaceActionClient
  .bindArgsSchemas(workspaceIdrequestParams)
  .inputSchema(exportContactsRequest)
  .action(
    async ({
      ctx: { user },
      bindArgsParsedInputs: [workspaceId],
      parsedInput,
    }: {
      ctx: { user: UserModel }
      bindArgsParsedInputs: WorkspaceIdRequestParams
      parsedInput: ExportContactsRequest
    }): Promise<ExportContactsResponse> => {
      const scope = await resolveContactPermissionScope(workspaceId)
      if (!scope) {
        throw new OpenMeerkatException(
          "User is not associated with this workspace",
        )
      }

      const canExportEmailAndPhone = scope.canViewEmailAndPhone
      const fields = stripContactPIIFields(
        parsedInput.fields,
        canExportEmailAndPhone,
      )

      // The worker resolves the filter and counts records. The action only
      // records the export request and enqueues the job.
      const filter = parsedInput.exportAll
        ? {
            keyword: parsedInput.filter?.keyword,
            contactFilter: parsedInput.filter?.contactFilter,
          }
        : undefined
      const contactIds = parsedInput.exportAll
        ? undefined
        : (parsedInput.contactIds ?? [])

      const fileId = createId()
      const fileName = `contacts-${new Date().toISOString().slice(0, 10)}.csv`
      const outputPath = `workspaces/${workspaceId}/exports/contacts/contact_${fileId}.csv`

      await db.insert(fileModel).values({
        id: fileId,
        workspaceId,
        userId: user.id,
        contextType: fileContextTypes.enum.export,
        subType: exportSubTypes.enum.contacts,
        path: outputPath,
        fileName,
        mimeType: "text/csv",
        status: fileStatuses.enum.pending,
      })

      await Promise.all([
        defaultQueue.add(DefaultJobAction.exportContacts, {
          type: DefaultJobAction.exportContacts,
          data: {
            workspaceId,
            requestedUserId: user.id,
            fileId,
            fields,
            canExportEmailAndPhone,
            outputPath,
            outputFormat: "csv",
            ...(scope.restrictToAssignedUserId
              ? { restrictToAssignedUserId: scope.restrictToAssignedUserId }
              : {}),
            ...(filter ? { filter } : { contactIds: contactIds ?? [] }),
          },
        }),
        defaultQueue.add(DefaultJobAction.sendAuditLog, {
          type: DefaultJobAction.sendAuditLog,
          data: {
            userId: user.id,
            workspaceId,
            action: "export",
            detail: "Contacts",
          },
        }),
      ])

      return { fileId }
    },
  )
