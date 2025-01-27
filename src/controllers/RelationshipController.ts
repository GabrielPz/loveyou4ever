import { FastifyReply, FastifyRequest } from "fastify";
import { relationshipServices } from "../services/RelationshipServices";
import { userSchema } from "../schemas/UserSchemas";
import { relationshipSchema } from "../schemas/RelationshipSchema";

export const RelationshipController = {
  async createRelationship(request: FastifyRequest, reply: FastifyReply) {
    const relationshipData = relationshipSchema.parse(request.body);
    const relationship = await relationshipServices.createRelationShip(relationshipData);
    return reply.status(201).send(relationship);
  },

  async getRelationshipById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const relationship = await relationshipServices.getRelationshipById(id);
    if (!relationship) {
      return reply.status(404).send({ message: "Relacionamento não encontrado" });
    }
    return reply.status(200).send(relationship);
  },

  async getAllRelationships(request: FastifyRequest, reply: FastifyReply) {
    const relationships = await relationshipServices.getAllRelationships();
    return reply.status(200).send(relationships);
  },

  async updateRelationship(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const relationshipData = relationshipSchema.partial().parse(request.body);
    const relationship = await relationshipServices.updateRelationship(id, relationshipData);
    return reply.status(200).send(relationship);
  },

  async deleteRelationship(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await relationshipServices.deleteRelationship(id);
    return reply.status(204).send();
  },
};
