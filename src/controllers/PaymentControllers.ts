import { FastifyReply, FastifyRequest } from "fastify";
import { paymentSchema } from "../schemas/PaymentSchema";
import { paymentService } from "../services/PaymentServices";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";

const stripe = new Stripe('sk_test_51QoXWMErz5C39pOb8Dc7lUDCx1VmSitD1uuL80OSfa7nHECkFmZtqYWTfw3dXGOyNHRA5UGuIspfLNw22m42w53C00FYh9ML5O', {
  apiVersion: '2025-01-27.acacia',
});


export const paymentController = {
  async webhook(request: FastifyRequest, reply: FastifyReply) {
    const sig = request.headers['stripe-signature'];
    const webhookSecret = 'whsec_YOUR_SECRET';
    let event;
  
    if (!request.rawBody) {
      return reply.status(400).send('Raw body is missing.');
    }
  
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody as Buffer, // ✅ Garantimos que é um Buffer
        sig as string,
        webhookSecret
      );
    } catch (err) {
      console.log(`Webhook Error: ${(err as Error).message}`);
      return reply.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
  
      try {
        await prisma.relationships.update({
          where: {
            id: session.client_reference_id as string,
          },
          data: {
            paymentId: session.payment_intent as string,
            status: 'PAID',
          },
        });
  
        await prisma.payments.update({
          where: {
            relationShipId: session.client_reference_id as string,
          },
          data: {
            status: 'PAID',
          },
        });
  
        console.log(`Relationship ${session.client_reference_id} updated successfully.`);
      } catch (error) {
        console.error('Erro ao atualizar o relacionamento:', error);
      }
    }
  
    return reply.status(200).send({ received: true });
  },
  
  async getAllPayments(request: FastifyRequest, reply: FastifyReply) {
    const payments = await paymentService.getAllPayments();
    return reply.status(200).send(payments);
  },
};
