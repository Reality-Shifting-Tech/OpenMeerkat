import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    OPENMEERKAT_API_KEY: z.string().default(""),
    // TODO: replace with deployed domain
    OPENMEERKAT_API_URL: z.url().default("https://api.openmeerkat.com"),
    OPENMEERKAT_ALLOW_SELF_SIGNED_CERT: z.enum(["true", "false"]).optional(),
    OPENMEERKAT_MCP_TRANSPORT: z.enum(["stdio", "sse", "both"]).default("both"),
    OPENMEERKAT_MCP_HOST: z.string().default("0.0.0.0"),
    OPENMEERKAT_MCP_PORT: z.coerce.number().int().positive().default(3333),
    OPENMEERKAT_MCP_SSE_PATH: z.string().default("/sse"),
    OPENMEERKAT_MCP_MESSAGES_PATH: z.string().default("/messages"),
    OPENMEERKAT_MCP_CORS_ORIGIN: z.string().default("*"),
    OPENMEERKAT_MCP_SERVER_NAME: z.string().optional(),
    OPENMEERKAT_MCP_SERVER_INSTRUCTIONS: z
      .string()
      .default(
        "This MCP server is connected to the user's live OpenMeerkat workspace. Whenever the user asks about anything related to their OpenMeerkat workspace — tags, contacts, conversations, broadcasts, flows, sequences, team members, inboxes, or any workspace data — you MUST use the available MCP tools to fetch real-time data. Do NOT answer from training knowledge or provide OpenMeerkat product documentation.",
      ),
  },
  runtimeEnv: process.env,
})
