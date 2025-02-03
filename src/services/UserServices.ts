import { prisma } from "../lib/prisma";
import { Role, User } from "@prisma/client";
import { UserDTO } from "../schemas/UserSchemas";
import bcrypt from "bcrypt";

export const userService = {
  async createUser(data: UserDTO): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        role: data?.role || Role.USER,
      },
    });
  },

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateUser(id: string, data: Partial<UserDTO>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: data,
    });
  },

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },
};
