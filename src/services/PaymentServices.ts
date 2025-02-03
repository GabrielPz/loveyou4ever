import { prisma } from "../lib/prisma";
import { Payments } from "@prisma/client";
import { PaymentDTO, PaymentResponseDTO } from "../schemas/PaymentSchema";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_Ho24N7La5CVDtbmpjc377lJI', {
  apiVersion: '2025-01-27.acacia',
});
const DOMAIN = 'http://localhost:4242';

export const paymentService = {
  async createPayment(data: PaymentDTO): Promise<PaymentResponseDTO> {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: '{{PRICE_ID}}', // Substitua pelo preço correto do Stripe
            quantity: 1,
          },
        ],
        mode: 'payment',
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
