# @openmeerkat/vitest-config

Shared Vitest presets for the OpenMeerkat monorepo. Mirrors how
[`@openmeerkat/typescript-config`](../typescript-config) works for TypeScript:
one place to bump versions, one place to tune the config.

## Presets

| Preset | Environment | Use for |
|--------|-------------|---------|
| `@openmeerkat/vitest-config/node` | `node` | Libraries, workers, CLIs, integrations |
| `@openmeerkat/vitest-config/react` | `jsdom` + React | `@openmeerkat/ui` and other React libs |
| `@openmeerkat/vitest-config/nextjs` | `jsdom` + React + Next.js | `apps/builder` |

## Usage

In a workspace's `vitest.config.ts`:

```ts
import preset from "@openmeerkat/vitest-config/node" // or /react, /nextjs

export default preset
```

To extend a preset with workspace-specific overrides:

```ts
import { mergeConfig } from "vitest/config"
import preset from "@openmeerkat/vitest-config/node"

export default mergeConfig(preset, {
  test: {
    setupFiles: ["./test/setup.ts"],
  },
})
```

## MSW (HTTP mocking)

The preset boots a shared MSW server before every test suite. The server
starts with **no default handlers** — `@openmeerkat/vitest-config` is a pure
lifecycle module and knows nothing about specific upstream APIs. Outbound HTTP
requests are still intercepted, and **any request without a matching handler
fails the test** (`onUnhandledRequest: "error"`).

### Where handlers live

Each integration that mocks an upstream HTTP API owns its own handler module
and ships it as a `./test-handlers` export:

| Package | Export | Mocks |
|---------|--------|-------|
| `@openmeerkat/integration-telegram` | `/test-handlers` | Telegram Bot API |
| `@openmeerkat/integration-whatsapp` | `/test-handlers` | WhatsApp Cloud API |
| `@openmeerkat/integration-messenger` | `/test-handlers` | Facebook Graph (Messenger) |
| `@openmeerkat/integration-zalo` | `/test-handlers` | Zalo OA |
| `@openmeerkat/integration-openai` | `/test-handlers` | OpenAI chat + embeddings |
| `@openmeerkat/integration-google-sheets` | `/test-handlers` | Google Sheets |

Each module exports `testHandlers` (an array of `RequestHandler` from MSW).

### Opt-in from a test

Use `beforeEach` (not `beforeAll`) to register integration baselines, because
`setup-msw.ts` resets handlers between every test:

```ts
import { server, http, HttpResponse } from "@openmeerkat/vitest-config/msw"
import { testHandlers as telegramHandlers } from "@openmeerkat/integration-telegram/test-handlers"
import { beforeEach, test } from "vitest"

beforeEach(() => {
  server.use(...telegramHandlers)
})

test("handles Telegram send error", async () => {
  server.use(
    http.post("https://api.telegram.org/bot:token/sendMessage", () =>
      HttpResponse.json({ ok: false, error_code: 400 }, { status: 400 }),
    ),
  )

  // ...exercise code that calls Telegram
})
```

Why `beforeEach`: `setup-msw.ts` calls `server.resetHandlers()` after each
test to wipe any per-test `server.use(...)` overrides. That reset also wipes
anything registered in `beforeAll`, so baselines need to be re-applied per
test. The tiny per-test overhead is negligible (MSW handlers are
in-memory).

## Database side-effects

[`packages/database/src/client.ts`](../database/src/client.ts) opens a real
`pg.Pool` on import. Two strategies:

1. **Mock the module** — preferred for unit tests that don't actually need a DB:

   ```ts
   import { vi } from "vitest"

   vi.mock("@openmeerkat/database/client", () => ({
     db: {
       /* stub */
     },
   }))
   ```

2. **Use the env defaults** — `setup-env.ts` sets `DATABASE_URL` to a
   non-routable address so connection attempts fail fast (5s) rather than
   reaching a real DB.

## Coverage thresholds

The presets enforce **80% coverage** for lines, functions, branches, and
statements when `pnpm test:coverage` runs. To temporarily skip thresholds while
real tests are being written:

```bash
VITEST_SKIP_COVERAGE_THRESHOLDS=1 pnpm test:coverage
```
