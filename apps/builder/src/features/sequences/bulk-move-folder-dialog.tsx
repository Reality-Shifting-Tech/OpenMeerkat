"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { folderTypes } from "@openmeerkat/database/partials"
import { ComboboxField } from "@openmeerkat/ui/components/form/combobox-field"
import { Button } from "@openmeerkat/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@openmeerkat/ui/components/ui/dialog"
import { Form } from "@openmeerkat/ui/components/ui/form"
import { zodBigintAsString } from "@openmeerkat/utils"
import { FolderUpIcon, Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type { ComponentPropsWithoutRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { changeFolderAction } from "../folders/actions/change-folder.action"
import { useFolderSelectOptions } from "../folders/provider/folder-hook"
import type { SequenceResource } from "./schema/resource"

type BulkMoveFolderDialogProps = ComponentPropsWithoutRef<typeof Dialog> & {
  workspaceId: string
  sequences: SequenceResource[]
  showTrigger?: boolean
  onSuccess?: () => void
  onOpenChange: (val: boolean) => void
}

const bulkMoveFolderSchema = z.object({
  newFolderId: zodBigintAsString(),
})

export function BulkMoveFolderDialog({
  workspaceId,
  sequences,
  showTrigger = true,
  onSuccess,
  onOpenChange,
  ...props
}: BulkMoveFolderDialogProps) {
  const t = useTranslations()
  const router = useRouter()
  const folderOptions = useFolderSelectOptions()

  const form = useForm<z.infer<typeof bulkMoveFolderSchema>>({
    resolver: zodResolver(bulkMoveFolderSchema),
    defaultValues: {
      newFolderId: "",
    },
  })

  const handleBulkMove = async (
    values: z.infer<typeof bulkMoveFolderSchema>,
  ) => {
    try {
      await Promise.all(
        sequences.map((sequence) =>
          changeFolderAction(workspaceId, {
            modelIds: [sequence.id],
            newFolderId: values.newFolderId,
            folderType: folderTypes.enum.sequence,
          }),
        ),
      )
      toast.success(
        t("messages.updatedSuccess", {
          feature: t("fields.folder.label"),
        }),
      )
      form.reset()
      onOpenChange(false)
      onSuccess?.()
      router.refresh()
    } catch (error) {
      console.error("Error moving sequences:", error)
      toast.error(t("messages.unknownError"))
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      {showTrigger ? (
        <DialogTrigger
          render={
            <Button size="sm" variant="outline">
              <FolderUpIcon aria-hidden="true" className="size-4" />
              {t("actions.move")}
            </Button>
          }
        />
      ) : null}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t("messages.moveFeature", {
              feature: t("fields.sequences.label"),
            })}
          </DialogTitle>
          <DialogDescription className="whitespace-pre-wrap text-sm/6">
            {t("messages.moveFolderDescription", {
              count: sequences.length,
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleBulkMove)}
          >
            <ComboboxField
              emptyText={t("actions.noRecordFound")}
              label={t("fields.folder.label")}
              name="newFolderId"
              options={folderOptions}
              placeholder={t("actions.pleaseSelect")}
              required
            />

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => onOpenChange(false)}
                size="sm"
                type="button"
                variant="ghost"
              >
                {t("actions.cancel")}
              </Button>
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                size="sm"
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="me-2 size-4 animate-spin" />
                )}
                {t("actions.confirm")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
