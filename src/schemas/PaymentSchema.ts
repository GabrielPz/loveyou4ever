import { z } from "zod";

export const paymentSchema = z.object({
  relationshipId: z.number(),
  priceId: z.string().min(1, { message: "O preço é obrigatório." }),
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
});

export const paymentSchemaResponse = z.object({
  redirect_url: z.string(),
});

export type PaymentDTO = z.infer<typeof paymentSchema>;
export type PaymentResponseDTO = z.infer<typeof paymentSchemaResponse>;
