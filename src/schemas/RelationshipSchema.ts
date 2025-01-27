import { Relationships } from "@prisma/client";
import { string, z } from "zod";

export const relationshipSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  paymentId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RelationshipDTO = z.infer<typeof relationshipSchema>;
