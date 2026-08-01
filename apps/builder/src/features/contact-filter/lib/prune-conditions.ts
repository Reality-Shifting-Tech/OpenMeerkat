import type { ContactFilterField } from "@openmeerkat/database/partials"
import type { ContactFilterCondition } from "../schemas"

export const pruneExcludedConditions = (
  conditions: ContactFilterCondition[],
  excludeFields: ContactFilterField[],
): ContactFilterCondition[] => {
  if (excludeFields.length === 0) {
    return conditions
  }

  return conditions.filter(
    (condition) =>
      !excludeFields.includes(condition.field as ContactFilterField),
  )
}
