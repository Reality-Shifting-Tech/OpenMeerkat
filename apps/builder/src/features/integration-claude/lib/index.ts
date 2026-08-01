import { aiProviders } from "@openmeerkat/ai"
import { verifyAiProviderApiKey } from "@/features/integration-ai/lib/verify-api-key"

export const verifyClaudeApiKey = (apiKey: string) =>
  verifyAiProviderApiKey(aiProviders.enum.claude, apiKey)
