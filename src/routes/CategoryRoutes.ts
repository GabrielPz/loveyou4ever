import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { categoryController } from "../controllers/CategoryControllers";
import { categorySchema } from "../schemas/CategorySchemas";
import { authController } from "../controllers/AuthControllers";
import { z } from "zod";

export async function rentedMovieRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/category",
    {
      preHandler: [
        authController.autenticarToken,
        authController.checkRole(["ADMIN"]),
      ],
      schema: {
        summary: "Create Category",
        tags: ["Category"],
        body: categorySchema,
        response: {
          201: categorySchema.extend({
            id: z.string().uuid(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    categoryController.createCategory
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/category",
    {
      preHandler: [authController.autenticarToken],
      schema: {
        summary: "Get All Categories",
        tags: ["Category"],
        response: {
          200: z.array(
            categorySchema.extend({
              id: z.string().uuid(),
            })
          ),
          400: z.object({ message: z.string() }),
        },
      },
    },
    categoryController.getAllCategories
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/category/:id",
    {
      preHandler: [
        authController.autenticarToken,
        authController.checkRole(["ADMIN"]),
      ],
      schema: {
        summary: "Delete Rented Movie by ID",
        tags: ["Category"],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          400: z.object({ message: z.string() }),
        },
      },
    },
    categoryController.deletedCategory
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/category/:id",
    {
      preHandler: [
        authController.autenticarToken,
        authController.checkRole(["ADMIN"]),
      ],
      schema: {
        summary: "Update Category by ID",
        tags: ["Category"],
        params: z.object({ id: z.string().uuid() }),
        body: categorySchema.partial(),
        response: {
          200: categorySchema.extend({
            id: z.string().uuid(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    categoryController.updateCategory
  );
}
