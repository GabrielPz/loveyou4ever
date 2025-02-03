import { string, z } from "zod";

export const userSchema = z.object({
  email: z.string().email({ message: "O email deve ser válido." }),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export type UserDTO = z.infer<typeof userSchema>;
