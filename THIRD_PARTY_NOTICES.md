# Third-Party Notices

OpenMeerkat is a fork of the upstream community edition of the open-source
omnichannel chatbot platform. This file documents the provenance of the
codebase and its notable third-party foundations.

## Upstream project

- **Upstream community edition** — MIT License, Copyright (c) 2024-present
  AhaChat LLC. OpenMeerkat is a fork of this project; the MIT license permits
  sublicensing and relicensing of the combined work under AGPL-3.0; the
  upstream MIT license text is reproduced below.

  > MIT License
  >
  > Copyright (c) 2024-present AhaChat LLC
  >
  > Permission is hereby granted, free of charge, to any person obtaining a
  > copy of this software and associated documentation files (the "Software"),
  > to deal in the Software without restriction, including without limitation
  > the rights to use, copy, modify, merge, publish, distribute, sublicense,
  > and/or sell copies of the Software, and to permit persons to whom the
  > Software is furnished to do so, subject to the following conditions:
  >
  > The above copyright notice and this permission notice shall be included in
  > all copies or substantial portions of the Software.
  >
  > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  > IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  > FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  > AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  > LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  > FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
  > DEALINGS IN THE SOFTWARE.

- **AhaChat enterprise components** — The `apps/builder/src/enterprise/`
  directory (billing, audit logs, inbox teams, platform branding, email
  templates) was licensed under AhaChat LLC's separate commercial license and
  has been **removed** from this distribution. It is not part of OpenMeerkat.

## Runtime and tooling dependencies

The licenses of all runtime and tooling dependencies are declared in their
respective packages. See `pnpm-lock.yaml` and the `LICENSE` files inside
`node_modules/` for the authoritative texts.

Notable foundations and their licenses:

- [Next.js](https://nextjs.org) — MIT
- [React](https://react.dev) — MIT
- [Drizzle ORM](https://orm.drizzle.team) — Apache-2.0
- [BullMQ](https://bullmq.io) — MIT
- [Zod](https://zod.dev) — MIT
- [Turborepo](https://turbo.build) — MIT
- [TypeScript](https://www.typescriptlang.org) — Apache-2.0
- [Biome](https://biomejs.dev) (Ultracite) — MIT / Apache-2.0
- [pnpm](https://pnpm.io) — MIT
