import { messageEventBus } from "@openmeerkat/event-bus"
import { messageListeners } from "./listener"

export default {
  bus: messageEventBus,
  listeners: messageListeners,
}
