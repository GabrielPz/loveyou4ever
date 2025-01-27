import { string, z } from "zod";

export const userSchema = z.object({
  email: z.string().email({ message: "O email deve ser válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export type UserDTO = z.infer<typeof userSchema>;
