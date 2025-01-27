import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { RelationshipController } from "../controllers/RelationshipController";
import { z } from "zod";
import { relationshipSchema } from "../schemas/RelationshipSchema";

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/relationships",
    {
      schema: {
        summary: "Create Relationship",
        tags: ["Relationships"],
        body: relationshipSchema,
        response: {
          201: relationshipSchema.extend({ id: z.string().uuid() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    RelationshipController.createRelationship
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/relationships/:id",
    {
      schema: {
        summary: "Get Relationship by ID",
        tags: ["Relationships"],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: relationshipSchema.extend({ id: z.string().uuid() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    RelationshipController.getRelationshipById
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/relationships",
    {
      schema: {
        summary: "Get All relationships",
        tags: ["Relationships"],
        response: {
          200: z.array(relationshipSchema.extend({ id: z.string().uuid() })),
        },
      },
    },
    RelationshipController.getAllRelationships
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/relationships/:id",
    {
      schema: {
        summary: "Update Relationships by ID",
        tags: ["Relationships"],
        params: z.object({ id: z.string().uuid() }),
        body: relationshipSchema.partial(),
        response: {
          200: relationshipSchema.extend({ id: z.string().uuid() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    RelationshipController.updateRelationship
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/relationships/:id",
    {
      schema: {
        summary: "Delete Relationships by ID",
        tags: ["Relationshipss"],
        params: z.object({ id: z.string().uuid() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    RelationshipController.deleteRelationship
  );
}
