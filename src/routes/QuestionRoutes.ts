import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { questionController } from "../controllers/QuestionControllers";
import { z } from "zod";
import { questionSchema } from "../schemas/QuestionSchemas";
import { authController } from "../controllers/AuthControllers";
const { autenticarToken, checkRole, saveTokenInfo } = authController;

export async function movieRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/questions",
    {
      preHandler: [autenticarToken, checkRole(["ADMIN"])],
      schema: {
        summary: "Create Movie",
        tags: ["Questions"],
        body: questionSchema,
        response: {
          201: questionSchema.extend({ id: z.string().uuid() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    questionController.createQuestion
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/questions/:id",
    {
      preHandler: [saveTokenInfo],
      schema: {
        summary: "Get Movie by ID",
        tags: ["Questions"],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: questionSchema.extend({
            id: z.string().uuid(),
            rentedByCurrentUser: z.boolean(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    questionController.getQuestionById
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/questions",
    {
      preHandler: [autenticarToken],
      schema: {
        summary: "Get All questions",
        tags: ["Questions"],
        querystring: z.object({
          quantity: z.string().optional(),
          categoryId: z.string().uuid().optional(),
        }),
        response: {
          200: z.array(
            questionSchema.extend({
              id: z.string().uuid(),
            })
          ),
        },
      },
    },
    questionController.getAllQuestions
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/questions/:id",
    {
      preHandler: [autenticarToken, checkRole(["ADMIN"])],
      schema: {
        summary: "Update question by ID",
        tags: ["Questions"],
        params: z.object({ id: z.string().uuid() }),
        body: questionSchema.partial(),
        response: {
          200: questionSchema.extend({
            id: z.string().uuid(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    questionController.updateQuestion
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/questions/:id",
    {
      preHandler: [autenticarToken, checkRole(["ADMIN"])],
      schema: {
        summary: "Delete questions by ID",
        tags: ["Questions"],
        params: z.object({ id: z.string().uuid() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    questionController.deleteQuestion
  );
}
