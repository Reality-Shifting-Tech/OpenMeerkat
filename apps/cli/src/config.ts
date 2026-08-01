import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { parseBooleanEnv } from "./commands/utils"
import { env } from "./env"

export type ConfigOptions = {
  apiKey?: string
  apiUrl?: string
  allowSelfSignedCert?: boolean
}

export type CliConfig = {
  apiKey: string
  apiUrl: string
  allowSelfSignedCert?: boolean
}

const CONFIG_DIR = ".openmeerkat"
const CONFIG_FILE = "config.json"

const getConfigFilePath = (): string => join(homedir(), CONFIG_DIR, CONFIG_FILE)

const readStoredConfig = (): ConfigOptions => {
  try {
    const raw = readFileSync(getConfigFilePath(), "utf8")
    const parsed = JSON.parse(raw) as ConfigOptions
    return parsed
  } catch {
    return {}
  }
}

const writeStoredConfig = (config: ConfigOptions): void => {
  const dir = join(homedir(), CONFIG_DIR)
  mkdirSync(dir, { recursive: true })
  writeFileSync(getConfigFilePath(), JSON.stringify(config, null, 2), "utf8")
}

export const setApiKey = (apiKey: string): void => {
  const trimmedApiKey = apiKey.trim()

  if (!trimmedApiKey) {
    throw new Error("API key is empty")
  }

  const current = readStoredConfig()
  writeStoredConfig({
    ...current,
    apiKey: trimmedApiKey,
  })
}

export const setApiUrl = (apiUrl: string): void => {
  const trimmedApiUrl = apiUrl.trim()

  if (!trimmedApiUrl) {
    throw new Error("API URL is empty")
  }

  const current = readStoredConfig()
  writeStoredConfig({
    ...current,
    apiUrl: trimmedApiUrl,
  })
}

export const setAllowSelfSignedCert = (allowSelfSignedCert: boolean): void => {
  const current = readStoredConfig()
  writeStoredConfig({
    ...current,
    allowSelfSignedCert,
  })
}

export const getConfig = (overrides?: ConfigOptions): CliConfig => {
  const stored = readStoredConfig()

  const apiKey = overrides?.apiKey ?? env.OPENMEERKAT_API_KEY ?? stored.apiKey

  const apiUrl = overrides?.apiUrl ?? env.OPENMEERKAT_API_URL ?? stored.apiUrl

  const allowSelfSignedCert =
    overrides?.allowSelfSignedCert ??
    parseBooleanEnv(env.OPENMEERKAT_ALLOW_SELF_SIGNED_CERT) ??
    stored.allowSelfSignedCert

  if (!apiKey) {
    throw new Error(
      "Missing API key. Run: openmeerkat config set --apiKey your_api_key",
    )
  }

  if (!apiUrl) {
    throw new Error(
      "Missing API URL. Run: openmeerkat config set --apiUrl your_api_url",
    )
  }

  return {
    apiKey,
    apiUrl,
    allowSelfSignedCert,
  }
}
