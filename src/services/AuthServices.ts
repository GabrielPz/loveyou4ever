import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDTO } from "../schemas/AuthSchemas";

export const authService = {
  async login(data: LoginDTO) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const chaveSecreta = process.env.SECRET_KEY_JWT;
    if (!chaveSecreta) {
      throw new Error("Secret key not found");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, chaveSecreta, {});

    return {
      token,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  },

  async verifyToken(token: string) {
    const chaveSecreta = process.env.SECRET_KEY_JWT;
    if (!chaveSecreta) {
      throw new Error("Secret key not found");
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, chaveSecreta, (erro: any, decoded: any) => {
        if (erro) {
          return reject(erro);
        }
        resolve(decoded);
      });
    });
  },
};
