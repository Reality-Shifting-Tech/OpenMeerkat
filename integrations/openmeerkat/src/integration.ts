import {
  type BaseConfig,
  type HandleRequestProps,
  Integration,
  type IntegrationDefinition,
  type Oauth2AuthValue,
} from "@openmeerkat/sdk"
import type { OpenmeerkatAuthValue } from "./auth"

const config: IntegrationDefinition<BaseConfig, OpenmeerkatAuthValue> = {
  name: "openmeerkat",
  channels: {
    channel: {
      message: {},
    },
  },
  actions: {},
  handleRequest(
    _props: HandleRequestProps<BaseConfig>,
  ): Promise<string | number | Oauth2AuthValue> {
    throw new Error("Method is not implemented.")
  },
  disconnect(_props: OpenmeerkatAuthValue): Promise<void> {
    throw new Error("Method is not implemented.")
  },
}

export const integration = new Integration(config)
