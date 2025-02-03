import { prisma } from "../lib/prisma";
import { Payments } from "@prisma/client";
import { PaymentDTO, PaymentResponseDTO } from "../schemas/PaymentSchema";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51QoXWMErz5C39pOb8Dc7lUDCx1VmSitD1uuL80OSfa7nHECkFmZtqYWTfw3dXGOyNHRA5UGuIspfLNw22m42w53C00FYh9ML5O', {
  apiVersion: '2025-01-27.acacia',
});
const DOMAIN = 'http://localhost:4242';

export const paymentService = {
  async createPayment(data: PaymentDTO): Promise<PaymentResponseDTO> {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1QoXdYErz5C39pObuoZ3ZrkX', // Substitua pelo preço correto do Stripe
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: data.relationshipId,
        success_url: `${DOMAIN}?success=true`,
        cancel_url: `${DOMAIN}?canceled=true`,
      });
      
      return {
        redirect_url: session.url || '',
      };
    } catch (error: any) {
      throw new Error("Erro ao criar pagamento: " + error.message);
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
