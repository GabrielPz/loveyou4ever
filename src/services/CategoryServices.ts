import { prisma } from "../lib/prisma";
import { CategoryDTO } from "../schemas/CategorySchemas";

export const categoryService = {
  async addCategory(data: CategoryDTO) {
    console.log("check data", data);
    return prisma.category.create({
      data,
    });
  },

  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  async updateCategory(id: string, data: Partial<CategoryDTO>) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  async deletedCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },
};
