import { flowEventBus } from "@openmeerkat/event-bus"
import { flowListeners } from "./listener"

export default {
  bus: flowEventBus,
  listeners: flowListeners,
}
