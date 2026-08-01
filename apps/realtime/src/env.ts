import { keys as partysocketKeys } from "@openmeerkat/partysocket-config/keys"
import { createEnv } from "@t3-oss/env-core"

export const env = createEnv({
  extends: [partysocketKeys()],
  server: {},
  runtimeEnv: process.env,
})
