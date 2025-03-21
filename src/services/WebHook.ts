import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import axios from "axios";
import { prisma } from "../lib/prisma";
import { mailService } from "./NodeMailer";

export async function Webhook(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/webhook", { config: { rawBody: true } }, async (request, reply) => {
      try {
        const data = request.body as any;
        if(data.action !== "payment.updated") {
          return reply.status(400).send({ message: "Ação inválida!" });
        }
        
        const id = data.data?.id || data?.id || "";

        const response = await axios.get(
          `https://api.mercadopago.com/v1/payments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN || ""}`,
            },
          }
        );

        const externalReference = response.data.external_reference || "";
        const status = response.data.status;

        const searchPayment = await prisma.payments.update({
          where: {
            relationShipId: externalReference,
          },
          data: {
            status: status === "approved" || status === "APPRO" ? "PAID" : "PENDING",
          },
        });

        const searchRelaitonship = await prisma.relationships.findFirst({
          where: {
            id: externalReference,
          },
        });

        if(!searchRelaitonship) {
          return reply.status(400).send({ message: "Erro ao processar ID de relacionamento!" });
        }

        const updateRelationship = await prisma.relationships.update({
          where: {
            id: externalReference,
          },
          data: {
            status: status === "approved" || status === "APPRO" ? "PAID" : "PENDING",
          },
        })

        if(!updateRelationship) {
          return reply.status(400).send({ message: "Erro ao processar ID de relacionamento!" });
        }

        const searchUser = await prisma.user.findFirst({
          where: {
            id: searchRelaitonship.userId,
          },
        });
        
        if(status === "approved" || status === "APPRO") {
          const sendQRCode = await mailService.sendEmail(searchUser?.email || '',searchRelaitonship.id);
        }

        return reply.status(200).send({ message: "Pagamento atualizado com sucesso!" });
      } catch (error: any) {
        console.log(error);
        return reply.status(400).send({ message: error.message });
      }
    });
}
