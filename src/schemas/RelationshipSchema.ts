import { z } from "zod";

// Enum para Plan baseado no modelo do Prisma
export const PlansEnum = z.enum(["BASIC", "PREMIUM", "SUPER_PREMIUM"]);

// Schema do usuário (simplificado)
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.enum(["USER", "ADMIN"]),
});

// Schema das imagens
export const imageSchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string().url(),
  contentDesc: z.string(),
  relationshipId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema dos pagamentos
export const paymentSchema = z.object({
  id: z.string().uuid(),
  relationShipId: z.string().uuid().optional(),
  plan: PlansEnum.optional(),
  amount: z.number().optional(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema principal do relacionamento
export const relationshipResponseSchema = z.object({
  id: z.string().uuid().optional(),
  videoLink: z.string().optional().nullable(),
  description: z.string().optional(),
  userId: z.string().uuid().optional(),
  paymentId: z.string().uuid().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  plan: z.string().optional(),

  relationshipDate: z.date().optional(),
  relationshipName: z.string().optional(),

  // Relações
  user: userSchema.optional(),
  images: z.array(imageSchema).optional(),
  Payments: paymentSchema.optional().nullable(),
});

export const relationshipSchema = z.object({
  userEmail: z.string().email(),
  content: z.string(),
  videoLink: z.string().optional(),
  relationshipDate: z.any(),
  relationshipName: z.string(),
  description: z.string(),
  plan: z.enum(["BASIC", "PREMIUM", "SUPER_PREMIUM"]),
});

// payer: z
//     .object({
//       email: z
//         .string()
//         .email({ message: "O email do pagador deve ser válido." }),
//       identification: z
//         .object({
//           type: z.enum(["CPF", "CNPJ"]).optional(),
//           number: z
//             .string()
//             .min(1, { message: "O número de identificação é obrigatório." }),
//         })
//     })


export type RelationshipResponseDTO = z.infer<typeof relationshipResponseSchema>;
export type RelationshipDTO = z.infer<typeof relationshipSchema>;
