import { randomUUID } from "node:crypto"
import QRCode from "qrcode"
import type { StoragePort } from "../ports/storage-port"

interface QrCodeGeneratorRequest {
  text: string
}

interface QrCodeGeneratorResponse {
  url: string
}

export class QrCodeGeneratorService {
  private readonly storage: StoragePort

  constructor(storage: StoragePort) {
    this.storage = storage
  }

  async generateAndUploadQrCode(
    request: QrCodeGeneratorRequest,
  ): Promise<QrCodeGeneratorResponse> {
    try {
      const { text } = request
      const dataUrl = await QRCode.toDataURL(text, { margin: 1, width: 200 })
      const base64 = dataUrl.split(",")[1]
      const pngQrCodeData = Buffer.from(base64, "base64")

      const url = await this.storage.uploadFile({
        fileName: randomUUID().toString(),
        buffer: pngQrCodeData,
        contentType: "image/png",
      })

      return { url }
    } catch (err) {
      throw new Error(`Error generating QR code: ${err}`)
    }
  }
}
