import { resolveTenantSettings } from "@openmeerkat/business"
import { getPublicFileUrl } from "@openmeerkat/business/utils"
import { uploader } from "@openmeerkat/filesystem"
import {
  AI_TEXT_TO_SPEECH_BASE64_ENCODING,
  AI_TEXT_TO_SPEECH_DEFAULT_EXTENSION,
  AI_TEXT_TO_SPEECH_DEFAULT_MIME_TYPE,
} from "@openmeerkat/flow-config"
import { createId } from "@openmeerkat/utils"

export type TTSAudioOutput = {
  publicUrl: string
  storagePath: string
  mimeType: "audio/mpeg" | "audio/wav"
  size: number
}

type SaveTextToSpeechAudioProps = {
  workspaceId: string
  conversationId: string
  executionId: string
  audioData: Uint8Array | string
  mediaType?: string
}

const allowedMimeTypes = new Set<TTSAudioOutput["mimeType"]>([
  "audio/mpeg",
  "audio/wav",
])

export const textToSpeechStorageService = {
  saveAudio: async ({
    workspaceId,
    conversationId,
    executionId,
    audioData,
    mediaType,
  }: SaveTextToSpeechAudioProps): Promise<TTSAudioOutput> => {
    const contentType = allowedMimeTypes.has(
      (mediaType ??
        AI_TEXT_TO_SPEECH_DEFAULT_MIME_TYPE) as TTSAudioOutput["mimeType"],
    )
      ? ((mediaType ??
          AI_TEXT_TO_SPEECH_DEFAULT_MIME_TYPE) as TTSAudioOutput["mimeType"])
      : AI_TEXT_TO_SPEECH_DEFAULT_MIME_TYPE

    const extension =
      contentType === "audio/wav" ? "wav" : AI_TEXT_TO_SPEECH_DEFAULT_EXTENSION

    const buffer =
      typeof audioData === "string"
        ? Buffer.from(audioData, AI_TEXT_TO_SPEECH_BASE64_ENCODING)
        : Buffer.from(audioData)

    if (buffer.length === 0) {
      throw new Error("[ai-text-to-speech] Empty audio payload from provider")
    }

    const fileName = `${createId()}.${extension}`
    const storagePath = `public/space/${workspaceId}/conversations/${conversationId}/${executionId}/${fileName}`

    await uploader.putObject(storagePath, buffer, {
      ContentType: contentType,
    })

    const { storageUrl } = await resolveTenantSettings({ workspaceId })
    const publicUrl = getPublicFileUrl(storagePath, storageUrl)

    return {
      publicUrl,
      storagePath,
      mimeType: contentType,
      size: buffer.length,
    }
  },
}
