import { getChildLogger } from "@openmeerkat/logger"

export const logger = getChildLogger("EventBus")
export const deadLetterLogger = getChildLogger("EventBus:DeadLetter")
