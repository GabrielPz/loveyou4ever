import { prisma } from "../lib/prisma";
import { Payments } from "@prisma/client";
import { PaymentDTO, PaymentResponseDTO } from "../schemas/PaymentSchema";
import { Payment as MercadoPagoPayment, MercadoPagoConfig, Preference } from "mercadopago";
import { relationshipServices } from "./RelationshipServices";

const client = new MercadoPagoConfig({
  accessToken:  process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});
const payments = new MercadoPagoPayment(client);


export const paymentService = {
  async createPayment(data: PaymentDTO): Promise<PaymentResponseDTO> {

    const {
      relationshipId,
      plan,
      payer,
    } = data;
    
    const relationship = await relationshipServices.getRelationshipById(relationshipId || "");
    if (!relationship) {
      throw new Error(
        `Relacionamento não encontrado com o ID: ${relationshipId}`
      );
    }

    let transactionAmmount = 1;
    let title = "Prata";

    if (plan === "PREMIUM") {
      transactionAmmount = 1.15;
      title = "Ouro";
    }  
    if (plan === "SUPER_PREMIUM") {
      transactionAmmount = 1.20;
      title = "Diamante";
    }

    const external_reference = relationshipId;
  
    try {
      const response = await payments.create({
        body:{
          external_reference: external_reference,
          notification_url: process.env.WEBHOOK_NOTIFICATION_URL || "",
          transaction_amount: transactionAmmount,
          payment_method_id: 'pix',
          description: "Pagamento do plano: " + title,
          payer: payer
        },
        requestOptions: { idempotencyKey: external_reference },
      });
      return {
        qr_code: response.point_of_interaction?.transaction_data?.qr_code,
        ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
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

  async registerPayment(relationshipId: string): Promise<Payments> {
    return prisma.payments.create({
     data: {
      relationShipId: relationshipId,
      status: "PENDING",
     }
    });
  },
};
