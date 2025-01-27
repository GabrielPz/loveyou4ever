import { prisma } from "../lib/prisma";
import { Category, Questions } from "@prisma/client";
import { QuestionDTO } from "../schemas/QuestionSchemas";

export const questionService = {
  async createQuestion(
    data: QuestionDTO,
    category: Category
  ): Promise<Questions> {
    return prisma.questions.create({
      data: {
        ...data,
        categoryId: category.id,
      },
    });
  },

  async getQuestionById(id: string): Promise<Questions | null> {
    return prisma.questions.findUnique({
      where: { id },
    });
  },

  async getAllQuestions(
    quantity?: number,
    categoryId?: string
  ): Promise<Questions[]> {
    const whereClause = categoryId ? { categoryId } : {};

    const questions = await prisma.questions.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (quantity) {
      // Shuffle the questions array
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      // Return the specified quantity of questions
      return questions.slice(0, quantity);
    }

    return questions;
  },

  async updateQuestion(
    id: string,
    data: Partial<QuestionDTO>
  ): Promise<Questions> {
    return prisma.questions.update({
      where: { id },
      data,
    });
  },

  async deleteQuestion(id: string): Promise<Questions> {
    return prisma.questions.delete({
      where: { id },
    });
  },
};
