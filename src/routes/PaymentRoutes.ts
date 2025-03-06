import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userController } from "../controllers/UserControllers";
import { z } from "zod";
import { userSchema } from "../schemas/UserSchemas";
import { authController } from "../controllers/AuthControllers";
import { paymentSchema, paymentSchemaResponse } from "../schemas/PaymentSchema";
import { paymentController } from "../controllers/PaymentControllers";
const { autenticarToken, checkRole } = authController;

export async function paymentRoutes(app: FastifyInstance) {
  
  app.withTypeProvider<ZodTypeProvider>().get(
    "/payments",
    {
      schema: {
        summary: "Get All Payments",
        tags: ["Payments"],
        response: {
          200: z.any(),
        },
      },
    },
    paymentController.getAllPayments
  );
}
