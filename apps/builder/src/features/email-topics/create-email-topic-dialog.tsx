"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { rootFolderId } from "@openmeerkat/database/partials"
import { InputField } from "@openmeerkat/ui/components/form/input-field"
import { Button } from "@openmeerkat/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@openmeerkat/ui/components/ui/dialog"
import { Form } from "@openmeerkat/ui/components/ui/form"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { createEmailTopicAction } from "./actions/create-email-topic-action"
import { createEmailTopicRequest } from "./schema/action"

type CreateEmailTopicDialogProps = {
  workspaceId: string
  folderId: string | null
}

export function CreateEmailTopicDialog({
  workspaceId,
  folderId,
}: CreateEmailTopicDialogProps) {
  const t = useTranslations()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(
      createEmailTopicAction.bind(null, workspaceId),
      zodResolver(createEmailTopicRequest),
      {
        actionProps: {
          onSuccess: () => {
            toast.success(
              t("messages.createdSuccess", {
                feature: t("fields.emailTopic.label"),
              }),
            )
            setOpen(false)
            resetFormAndAction()
            router.refresh()
          },
          onError: ({ error }: { error: { serverError?: string } }) => {
            if (error.serverError) {
              toast.error(error.serverError)
            }
          },
        },
        formProps: {
          mode: "onChange",
          defaultValues: { name: "", folderId: null },
        },
        errorMapProps: {},
      },
    )

  const { setValue } = form

  useEffect(() => {
    if (folderId && folderId !== rootFolderId) {
      setValue("folderId", folderId)
    }
  }, [folderId, setValue])

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        resetFormAndAction()
      }
    },
    [resetFormAndAction],
  )

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger
        render={
          <Button size="sm">
            <PlusIcon />
            {t("messages.createFeature", {
              feature: t("fields.emailTopic.label"),
            })}
          </Button>
        }
      />
      <DialogContent className="max-h-screen max-w-xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>
            {t("messages.createFeature", {
              feature: t("fields.emailTopic.label"),
            })}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={handleSubmitWithAction}>
            <InputField label={t("fields.name.label")} name="name" required />
            <DialogFooter>
              <DialogClose
                render={
                  <Button size="sm" type="button" variant="ghost">
                    {t("actions.cancel")}
                  </Button>
                }
              />
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                size="sm"
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="animate-spin" />
                )}
                {t("actions.confirm")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
