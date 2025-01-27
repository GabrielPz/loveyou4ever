import { z } from "zod";

export const paymentSchema = z.object({
  transaction_amount: z.number(),
  // .min(1, { message: "O valor da transação é obrigatório." }),
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
  payment_method_id: z
    .string()
    .min(1, { message: "O método de pagamento é obrigatório." }),
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
  installments: z
    .number()
    .min(1, { message: "O número de parcelas é obrigatório." }),
  token: z.string().optional(),
});

export const paymentSchemaResponse = z.object({
  qr_code: z.string().optional(),
  ticket_url: z.string().optional(),
});

export type PaymentDTO = z.infer<typeof paymentSchema>;
export type PaymentResponseDTO = z.infer<typeof paymentSchemaResponse>;
