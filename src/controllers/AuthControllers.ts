import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../services/AuthServices";
import { loginSchema, tokenSchema } from "../schemas/AuthSchemas";
import { prisma } from "../lib/prisma";

export const authController = {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const loginData = loginSchema.parse(request.body);
    try {
      const userData = await authService.login(loginData);
      return reply.status(200).send(userData);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).usuario.id;
    try {
      const user = await authService.getCurrentUser(userId);
      return reply.status(200).send(user);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  },

  async autenticarToken(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.headers["authorization"];
      if (!token) {
        return reply.status(401).send({ message: "Token não fornecido." });
      }
      const dadosDecodificados = await authService.verifyToken(token);
      (request as any).usuario = dadosDecodificados;
    } catch (error: any) {
      return reply
        .status(401)
        .send({ message: "Token inválido ou erro ao verificar." });
    }
  },

  async saveTokenInfo(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.headers["authorization"];
      if (!token) {
        return;
      }
      const dadosDecodificados = await authService.verifyToken(token);
      (request as any).usuario = dadosDecodificados;
    } catch (error: any) {
      return reply
        .status(401)
        .send({ message: "Token inválido ou erro ao verificar." });
    }
  },

  checkRole: (roles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const rqBody = (request as any).usuario;
      const user = await prisma.user.findUnique({
        where: { id: rqBody.id },
        select: { role: true },
      });

      if (!user || !roles.includes(user.role)) {
        return reply.status(403).send({ message: "Acesso negado" });
      }
    };
  },
};

export const checkRole = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const rqBody = (request as any).usuario;
    const user = await prisma.user.findUnique({
      where: {
        id: rqBody.id,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      return reply.status(401).send({ message: "User not found" });
    }
    if (!user || !roles.includes(user.role)) {
      return reply.status(403).send({ message: "Access denied" });
    }
  };
};
