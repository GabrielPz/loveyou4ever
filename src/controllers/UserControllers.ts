import { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../services/UserServices";
import { userSchema } from "../schemas/UserSchemas";

export const userController = {
  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const userData = userSchema.parse(request.body);
    const user = await userService.createUser(userData);
    return reply.status(201).send(user);
  },

  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = await userService.getUserById(id);
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    return reply.status(200).send(user);
  },

  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await userService.getAllUsers();
    return reply.status(200).send(users);
  },

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userData = userSchema.partial().parse(request.body);
    const user = await userService.updateUser(id, userData);
    return reply.status(200).send(user);
  },

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await userService.deleteUser(id);
    return reply.status(204).send();
  },
};
