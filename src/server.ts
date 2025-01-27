import { fastify, FastifyReply, FastifyRequest } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { authRoutes } from "./routes/AuthRoutes";
import { movieRoutes } from "./routes/QuestionRoutes";
import { userRoutes } from "./routes/UserRoutes";
import { rentedMovieRoutes } from "./routes/CategoryRoutes";
import { paymentRoutes } from "./routes/PaymentRoutes";

import fastifyRawBody from "fastify-raw-body";
import { errorHandler } from "./middlewares/ErrorMiddleware";
import { prisma } from "./lib/prisma";

const app = fastify();

// aqui determina qual o endereco do front-end que pode consumir nosso servidor
app.register(fastifyCors, {
  origin: "*",
});

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json", "multipart/form-data"],
    produces: ["application/json"],
    basePath: "http://localhost:8000",
    info: {
      title: "DrDalei API",

      description: "Especificações da API para o back-end da aplicação DrDalei",
      version: "1/",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(fastifyRawBody, {
  runFirst: true,
  global: false,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

async function checkAndSeed() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log("Seeding database...");
    await import("./seed");
  }
}

app.setErrorHandler(errorHandler);
app.register(movieRoutes, { prefix: "/api/v1" });
app.register(userRoutes, { prefix: "/api/v1" });
app.register(paymentRoutes, { prefix: "/api/v1" });
app.register(authRoutes, { prefix: "/api/v1" });
app.register(rentedMovieRoutes, { prefix: "/api/v1" });

app.listen({ port: 8000, host: "0.0.0.0" }).then(async () => {
  await checkAndSeed();
  console.log("Server is running on port 8000");
});
