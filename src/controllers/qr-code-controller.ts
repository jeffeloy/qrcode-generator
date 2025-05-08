import type { FastifyPluginOptions } from "fastify"
import z from "zod"
import type { QrCodeGeneratorService } from "../services/qr-code-generator-service"
import type { FastifyTypedInstance } from "../types"

declare module "fastify" {
  interface FastifyInstance {
    qrCodeService: QrCodeGeneratorService
  }
}

export function QrCodeController(qrCodeService: QrCodeGeneratorService) {
  return async function qrCodeController(
    app: FastifyTypedInstance,
    options: FastifyPluginOptions,
  ) {
    app.decorate("qrCodeService", qrCodeService)

    app.post(
      "/qrcode",
      {
        schema: {
          description: "Generate new QRCode",
          body: z.object({
            text: z.string(),
          }),
          response: {
            201: z.object({
              url: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { text } = request.body
        const { url } = await qrCodeService.generateAndUploadQrCode({ text })
        return reply.status(201).send({
          url: url,
        })
      },
    )
  }
}
