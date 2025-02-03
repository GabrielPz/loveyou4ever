import { Images } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ImageAndContent } from "../controllers/RelationshipController";

export const imageServices = {
  async createImage(imageData: ImageAndContent, relationShipId: string): Promise<Images> {
    return prisma.images.create({
      data: {
        contentDesc: imageData.content,
        imageUrl: imageData.imageUrl,
        relationshipId: relationShipId,
      },
    });
  },
};
