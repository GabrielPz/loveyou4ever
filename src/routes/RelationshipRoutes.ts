import { FastifyInstance } from "fastify";
import { ZodTypeProvider} from "fastify-type-provider-zod";
import { RelationshipController } from "../controllers/RelationshipController";
import { relationshipResponseSchema, relationshipSchema } from "../schemas/RelationshipSchema";
import fastifyMulter from "fastify-multer";
import { z } from "zod";

// Configuração do Multer
const upload = fastifyMulter({ storage: fastifyMulter.memoryStorage() });

export async function relationshipRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/relationships",
    {
      // ✅ Passar diretamente o upload.fields como preHandler
      preHandler: upload.fields([
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 1 },
        { name: 'file3', maxCount: 1 },
        { name: 'file4', maxCount: 1 },
        { name: 'file5', maxCount: 1 },
        { name: 'file6', maxCount: 1 },
        { name: 'file7', maxCount: 1 },
        { name: 'file8', maxCount: 1 },
        { name: 'file9', maxCount: 1 },
        { name: 'file10', maxCount: 1 },
      ]),

      schema: {
        summary: "Create Relationship",
        tags: ["Relationships"],
        consumes: ["multipart/form-data"],
        response: {
          201: relationshipResponseSchema.extend({ id: z.string().uuid() }),
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
          200: z.array(relationshipResponseSchema),
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
          200: z.array(relationshipResponseSchema),
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
        tags: ["Relationships"],
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
