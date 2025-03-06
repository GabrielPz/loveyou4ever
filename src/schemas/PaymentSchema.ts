import { z } from "zod";

export const paymentSchema = z.object({
  relationshipId: z.string(),
  plan: z.enum(["BASIC", "PREMIUM", "SUPER_PREMIUM"]),
  payer: z
    .object({
      email: z
        .string()
        .email({ message: "O email do pagador deve ser válido." }),
      identification: z
        .object({
          type: z.enum(["CPF", "CNPJ"]).optional(),
          number: z
            .string()
            .min(1, { message: "O número de identificação é obrigatório." }),
        })
        .optional(),
    })
    .optional(),
});

export const paymentSchemaResponse = z.object({
  qr_code: z.string().optional(),
  ticket_url: z.string().optional(),
});

export type PaymentDTO = z.infer<typeof paymentSchema>;
export type PaymentResponseDTO = z.infer<typeof paymentSchemaResponse>;
