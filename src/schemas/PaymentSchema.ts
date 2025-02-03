import { z } from "zod";

export const paymentSchema = z.object({
  relationshipId: z.string(),
  priceId: z.string().min(1, { message: "O preço é obrigatório." }).optional(),
});

export const paymentSchemaResponse = z.object({
  redirect_url: z.string(),
});

export type PaymentDTO = z.infer<typeof paymentSchema>;
export type PaymentResponseDTO = z.infer<typeof paymentSchemaResponse>;
