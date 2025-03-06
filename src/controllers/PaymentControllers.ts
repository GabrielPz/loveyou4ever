import { FastifyReply, FastifyRequest } from "fastify";
import { paymentSchema } from "../schemas/PaymentSchema";
import { paymentService } from "../services/PaymentServices";
import Stripe from "stripe";


export const paymentController = {
  
  async getAllPayments(request: FastifyRequest, reply: FastifyReply) {
    const payments = await paymentService.getAllPayments();
    return reply.status(200).send(payments);
  },
};
