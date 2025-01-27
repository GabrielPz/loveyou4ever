import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  password: z.string().min(6),
});

export const tokenSchema = z.object({
  token: z.string(),
  id: z.string().uuid(),
  name: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  email: z.string().email(),
});
export const currentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  email: z.string().email(),
  paid: z.boolean(),
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type TokenDTO = z.infer<typeof tokenSchema>;
