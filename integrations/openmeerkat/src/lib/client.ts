import type { Context } from "@openmeerkat/sdk"
import ky, { type KyInstance } from "ky"
import type { OpenmeerkatAuthValue } from "../auth"

export const getRealtimeClient = (
  ctx: Context<OpenmeerkatAuthValue>,
): KyInstance =>
  ky.create({
    headers: {
      "X-API-KEY": ctx.auth.apiKey,
    },
    baseUrl: ctx.auth.wsUrl,
  })
