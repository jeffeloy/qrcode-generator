import z from "zod"
import type { FastifyTypedInstance } from "./types"

export async function routes(app: FastifyTypedInstance) {
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
      return reply.status(201).send({
        url: "",
      })
    },
  )
}
