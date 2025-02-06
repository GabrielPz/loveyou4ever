import { z } from "zod";

export const paymentSchema = z.object({
  relationshipId: z.string(),
  plan: z.enum(["BASIC", "PREMIUM", "SUPER_PREMIUM"]),
});

export const paymentSchemaResponse = z.object({
  redirect_url: z.string(),
});

export type PaymentDTO = z.infer<typeof paymentSchema>;
export type PaymentResponseDTO = z.infer<typeof paymentSchemaResponse>;
