import { prisma } from "../lib/prisma";
import { Payments } from "@prisma/client";
import { PaymentDTO, PaymentResponseDTO } from "../schemas/PaymentSchema";
import { Payment as MercadoPagoPayment, MercadoPagoConfig, Preference } from "mercadopago";
import { relationshipServices } from "./RelationshipServices";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});
const preference = new Preference(client);


export const paymentService = {
  async createPayment(data: PaymentDTO): Promise<PaymentResponseDTO> {

    const {
      relationshipId,
      plan,
    } = data;
    const relationship = await relationshipServices.getRelationshipById(relationshipId || "");
    if (!relationship) {
      throw new Error(
        `Relacionamento não encontrado com o ID: ${relationshipId}`
      );
    }

    let transactionAmmount = 0.1;
    let title = "Prata";

    if (plan === "PREMIUM") {
      transactionAmmount = 0.15;
      title = "Ouro";
    }  
    if (plan === "SUPER_PREMIUM") {
      transactionAmmount = 0.20;
      title = "Diamante";
    }

    const external_reference = relationshipId;
  
    try {
      const response = await preference.create({
        body:{
          external_reference: external_reference,
          notification_url: process.env.WEBHOOK_NOTIFICATION_URL || "",
          // back_urls: {
          //   success: process.env.WEBHOOK_SUCCESS_URL || "",
          //   pending: process.env.WEBHOOK_PENDING_URL || "",
          //   failure: process.env.WEBHOOK_FAILURE_URL || "",
          // },
          items: [
            {
              id: external_reference,
              currency_id: "BRL",
              title: title,
              quantity: 1,
              unit_price: transactionAmmount
            }
          ],
        },
        requestOptions: { idempotencyKey: external_reference },
      });
      return {
        redirect_url: response?.sandbox_init_point || '',
      };
    } catch (error: any) {
      throw new Error("Erro ao criar pagamento:" + error.message);
    }
  },

  async getAllPayments(): Promise<Payments[]> {
    return prisma.payments.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
