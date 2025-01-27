import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  email: z.string().email({ message: "O email deve ser válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  role: z.enum(["USER", "ADMIN"]).optional(),
  job: z
    .enum([
      "ADVOGADO",
      "COMERCIARIO",
      "EMPRESARIO",
      "ESTUDANTE",
      "FUNCIONARIO_PUBLICO",
      "COMERCIANTE",
      "OUTROS",
    ])
    .optional(),
});

export type UserDTO = z.infer<typeof userSchema>;
