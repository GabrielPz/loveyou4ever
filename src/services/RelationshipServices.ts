import { prisma } from "../lib/prisma";
import { Relationships } from "@prisma/client";
import { RelationshipDTO } from "../schemas/RelationshipSchema";

export const relationshipServices = {
  async createRelationShip(data: RelationshipDTO, userId: string): Promise<Relationships> {
    return prisma.relationships.create({
      data: {
        description: data.description,
        Plan: data.plan,
        videoLink: data.videoLink,
        userId: userId,
      },
    });
  },

  async getRelationshipById(id: string): Promise<Relationships | null> {
    return prisma.relationships.findUnique({
      where: { id },
    });
  },

  async getRelationshipByUserId(id: string): Promise<Relationships[] | null> {
    return prisma.relationships.findMany({
      where: { userId: id },
    });
  },

  async getAllRelationships(): Promise<Relationships[]> {
    return prisma.relationships.findMany({
      include: {
        images: true,
        Payments: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateRelationship(id: string, data: Partial<RelationshipDTO>): Promise<Relationships> {
    return prisma.relationships.update({
      where: { id },
      data: data,
    });
  },

  async deleteRelationship(id: string): Promise<Relationships> {
    return prisma.relationships.delete({
      where: { id },
    });
  },
};
