import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import axios from "axios";
import { prisma } from "../lib/prisma";

export async function Webhook(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/webhook", { config: { rawBody: true } }, async (request, reply) => {
      try {
        const { data } = request.body as any;
        const { id } = data;
        const type = (request.body as any).type;

        const response = await axios.get(
          `https://api.mercadopago.com/v1/payments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MERCADO_PAGO_API_KEY || ""}`,
            },
          }
        );

        const externalReference = response.data.external_reference;
        const status = response.data.status;

        const searchUser = await prisma.user.update({
          where: {
            id: externalReference,
          },
          data: {
            paid: status === "paid",
          },
        });

        return reply.status(400).send({ message: "Usuário não encontrado" });
      } catch (error: any) {
        return reply.status(400).send({ message: error.message });
      }
    });
}
