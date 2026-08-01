"use client"

import {
  geminiImageModelOptions,
  openaiImageModelOptions,
} from "@openmeerkat/ai"
import type { AIGenerateImageProvider } from "@openmeerkat/flow-config"
import { ComboboxField } from "@openmeerkat/ui/components/form/combobox-field"
import type {
  SelectFieldProps,
  SelectOption,
} from "@openmeerkat/ui/components/form/select-field"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import type { FieldValues } from "react-hook-form"

const imageModelOptions: Record<AIGenerateImageProvider, SelectOption[]> = {
  openai: openaiImageModelOptions,
  gemini: geminiImageModelOptions,
}

type AIModelSelectProps = SelectFieldProps<FieldValues> & {
  provider: AIGenerateImageProvider
}

export const AIModelSelect = (props: AIModelSelectProps) => {
  const { provider, ...rest } = props
  const t = useTranslations()

  const options = useMemo(() => imageModelOptions[provider] ?? [], [provider])

  return (
    <ComboboxField
      emptyText={t("actions.noRecordFound")}
      label={t("fields.model.label")}
      options={options}
      placeholder={t("actions.pleaseSelect")}
      {...rest}
    />
  )
}
