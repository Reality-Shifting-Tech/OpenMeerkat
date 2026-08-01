import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    OPENMEERKAT_API_KEY: z.string().optional(),
    OPENMEERKAT_API_URL: z.url().optional(),
    OPENMEERKAT_ALLOW_SELF_SIGNED_CERT: z.enum(["true", "false"]).optional(),
  },
  runtimeEnv: process.env,
})
