import { FastifyReply, FastifyRequest } from "fastify";
import { questionService } from "../services/QuestionServices";
import { questionSchema } from "../schemas/QuestionSchemas";
import { categoryService } from "../services/CategoryServices";

export const questionController = {
  async createQuestion(request: FastifyRequest, reply: FastifyReply) {
    const questionData = questionSchema.parse(request.body);

    const category = await categoryService.getCategoryById(
      questionData.categoryId
    );
    if (!category) {
      return reply.status(404).send({ message: "Categoria não encontrada" });
    }

    try {
      const question = await questionService.createQuestion(
        questionData,
        category
      );
      return reply.status(201).send(question);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },

  async getQuestionById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const movie = await questionService.getQuestionById(id);
    if (!movie) {
      return reply.status(404).send({ message: "Filme não encontrado" });
    }
    return reply.status(200).send(movie);
  },

  async getAllQuestions(request: FastifyRequest, reply: FastifyReply) {
    const { quantity, categoryId } = request.query as {
      quantity?: number;
      categoryId?: string;
    };

    const questions = await questionService.getAllQuestions(
      quantity,
      categoryId
    );
    return reply.status(200).send(questions);
  },

  async updateQuestion(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const movieData = questionSchema.partial().parse(request.body);
    try {
      const movie = await questionService.updateQuestion(id, movieData);
      return reply.status(200).send(movie);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },

  async deleteQuestion(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {
      await questionService.deleteQuestion(id);
      return reply.status(204).send();
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },
};
