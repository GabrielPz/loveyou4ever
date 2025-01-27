import { FastifyReply, FastifyRequest } from "fastify";
import { categoryService } from "../services/CategoryServices";
import { categorySchema } from "../schemas/CategorySchemas";

export const categoryController = {
  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    const categorydata = categorySchema.parse(request.body);
    const category = await categoryService.addCategory(categorydata);
    return reply.status(201).send(category);
  },

  async getAllCategories(request: FastifyRequest, reply: FastifyReply) {
    const rentedMovies = await categoryService.getAllCategories();
    return reply.status(200).send(rentedMovies);
  },

  async deletedCategory(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await categoryService.deletedCategory(id);
    return reply.status(204).send();
  },

  async updateCategory(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const categoryData = categorySchema.partial().parse(request.body);
    const category = await categoryService.updateCategory(id, categoryData);
    return reply.status(200).send(category);
  },
};
