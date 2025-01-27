import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userController } from "../controllers/UserControllers";
import { z } from "zod";
import { userSchema } from "../schemas/UserSchemas";
import { authController } from "../controllers/AuthControllers";
const { autenticarToken, checkRole } = authController;

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        summary: "Create User",
        tags: ["Users"],
        body: userSchema,
        response: {
          201: userSchema.extend({ id: z.string().uuid() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    userController.createUser
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:id",

    {
      preHandler: [autenticarToken, checkRole(["ADMIN"])],

      schema: {
        summary: "Get User by ID",
        tags: ["Users"],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: userSchema.extend({ id: z.string().uuid() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    userController.getUserById
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/users",
    {
      preHandler: [autenticarToken, checkRole(["ADMIN"])],

      schema: {
        summary: "Get All Users",
        tags: ["Users"],
        response: {
          200: z.array(userSchema.extend({ id: z.string().uuid() })),
        },
      },
    },
    userController.getAllUsers
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/users/:id",
    {
      preHandler: [autenticarToken, checkRole(["ADMIN"])],
      schema: {
        summary: "Update User by ID",
        tags: ["Users"],
        params: z.object({ id: z.string().uuid() }),
        body: userSchema.partial(),
        response: {
          200: userSchema.extend({ id: z.string().uuid() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    userController.updateUser
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/users/:id",
    {
      preHandler: [autenticarToken, checkRole(["ADMIN"])],
      schema: {
        summary: "Delete User by ID",
        tags: ["Users"],
        params: z.object({ id: z.string().uuid() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    userController.deleteUser
  );
}
