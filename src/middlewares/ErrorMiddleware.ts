import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Trate erros conhecidos do Prisma
    switch (error.code) {
      case "P2002":
        return reply.status(409).send({
          message:
            "Já existe um registro com este valor no(s) campo(s):" +
            error.meta?.target,
        });
      // Adicione outros códigos de erro do Prisma conforme necessário
      default:
        return reply.status(400).send({
          message: "Erro no banco de dados",
          details: error.message,
        });
    }
  }

  let errorMessage = "Erro interno do servidor";
  let errorDetails = error.message;
  console.error(error);
  try {
    const parsedError = JSON.parse(error.message);
    if (Array.isArray(parsedError) && parsedError.length > 0) {
      errorMessage = parsedError[0].message || errorMessage;
    }
  } catch (e) {}

  return reply.status(error?.statusCode || 500).send({
    message: errorMessage,
  });
}
