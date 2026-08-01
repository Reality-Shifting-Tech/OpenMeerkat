"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  WHATSAPP_OPTION_LIST_DESCRIPTION_MAX,
  WHATSAPP_OPTION_LIST_TITLE_MAX,
  type WhatsappOptionListItem,
  type WhatsappOptionListOptionFormValues,
  whatsappOptionListOptionFormSchema,
} from "@openmeerkat/flow-config"
import { InputField } from "@openmeerkat/ui/components/form/input-field"
import { TextareaField } from "@openmeerkat/ui/components/form/textarea-field"
import { Button } from "@openmeerkat/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@openmeerkat/ui/components/ui/dialog"
import { useTranslations } from "next-intl"
import { memo } from "react"
import { FormProvider, useForm } from "react-hook-form"

type OptionDialogProps = {
  index: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (index: number, values: WhatsappOptionListOptionFormValues) => void
  currentItem: WhatsappOptionListItem | undefined
}

function OptionDialogInner({
  index,
  open,
  onOpenChange,
  onSave,
  currentItem,
}: OptionDialogProps) {
  const t = useTranslations()

  const form = useForm<WhatsappOptionListOptionFormValues>({
    resolver: zodResolver(whatsappOptionListOptionFormSchema),
    defaultValues: {
      title: currentItem?.title ?? "",
      description: currentItem?.description ?? "",
    },
    values: {
      title: currentItem?.title ?? "",
      description: currentItem?.description ?? "",
    },
    mode: "onChange",
  })

  const onSubmit = (values: WhatsappOptionListOptionFormValues) => {
    onSave(index, values)
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("flows.whatsappOptionList.editOptionTitle")}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
          >
            <InputField
              label={t("flows.whatsappOptionList.optionTitle")}
              maxLength={WHATSAPP_OPTION_LIST_TITLE_MAX}
              name="title"
              required
            />
            <TextareaField
              label={t("flows.whatsappOptionList.optionDescription")}
              maxLength={WHATSAPP_OPTION_LIST_DESCRIPTION_MAX}
              name="description"
            />
            <DialogFooter>
              <DialogClose
                render={
                  <Button size="sm" type="button" variant="ghost">
                    {t("actions.cancel")}
                  </Button>
                }
              />
              <Button
                disabled={!form.formState.isValid}
                size="sm"
                type="submit"
              >
                {t("actions.continue")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export const OptionDialog = memo(OptionDialogInner)
