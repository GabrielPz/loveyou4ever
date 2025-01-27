import { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../services/UserServices";
import { userSchema } from "../schemas/UserSchemas";
import { paymentSchema } from "../schemas/PaymentSchema";
import { paymentService } from "../services/PaymentServices";

export const paymentController = {
  async createPayment(request: FastifyRequest, reply: FastifyReply) {
    const paymentData = paymentSchema.parse(request.body);
    const payment = await paymentService.createPayment(paymentData);
    return reply.status(201).send(payment);
  },

  async getAllPayments(request: FastifyRequest, reply: FastifyReply) {
    const payments = await paymentService.getAllPayments();
    return reply.status(200).send(payments);
  },
};
