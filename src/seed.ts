import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  // Caminhos para os arquivos JSON de backup
  const categoriesPath = path.join(__dirname, "categories.json");
  const questionsPath = path.join(__dirname, "questions.json");

  // Leitura dos arquivos JSON
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
  const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

  // Inserção das categorias
  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Inserção das questões
  for (const question of questionsData) {
    await prisma.questions.upsert({
      where: { id: question.id },
      update: {},
      create: {
        correctAwser: question.correctAwser,
        question: question.question,
        categoryId: question.categoryId,
        choices: question.choices,
        type: question.type,
      },
    });
  }

  // Criação do usuário admin
  const adminEmail = "admin@drdalei.com";
  const adminPassword = "Admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
