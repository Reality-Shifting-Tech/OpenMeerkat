import type {
  ChannelType,
  CustomFieldType,
} from "@openmeerkat/database/partials"
import {
  ComboboxField,
  type ComboboxFieldProps,
} from "@openmeerkat/ui/components/form/combobox-field"
import type { FieldValues } from "react-hook-form"
import { useCustomFieldSelectOptions } from "../provider/custom-field-hook"

type CustomFieldFieldProps = Omit<
  ComboboxFieldProps<FieldValues>,
  "options"
> & {
  channels?: ChannelType[]
  customFieldTypes?: CustomFieldType[]
  includeReserved?: boolean
}

export default function CustomFieldField(props: CustomFieldFieldProps) {
  const { channels, customFieldTypes, includeReserved, ...rest } = props

  const customFieldOptions = useCustomFieldSelectOptions({
    channels,
    customFieldTypes,
    includeReserved,
  })

  return <ComboboxField {...rest} options={customFieldOptions} />
}
