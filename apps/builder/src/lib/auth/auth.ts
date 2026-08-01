import { createAuth } from "@openmeerkat/auth/server"
import { onUserCreated } from "./on-user-created"

export const auth = createAuth({ onUserCreated })
