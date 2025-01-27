import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { authController } from "../controllers/AuthControllers";
import {
  currentSchema,
  loginSchema,
  tokenSchema,
} from "../schemas/AuthSchemas";
import { z } from "zod";

export async function authRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        summary: "Login",
        tags: ["Auth"],
        body: loginSchema,
        response: {
          200: tokenSchema,
          400: z.object({ message: z.string() }),
        },
      },
    },
    authController.login
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/current",
    {
      preHandler: authController.autenticarToken,
      schema: {
        summary: "Get Current User",
        tags: ["Auth"],
        response: {
          200: currentSchema,
          400: z.object({ message: z.string() }),
        },
      },
    },
    authController.getCurrentUser
  );
}
