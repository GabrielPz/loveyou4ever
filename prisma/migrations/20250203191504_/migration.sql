/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `relationhips` table. All the data in the column will be lost.
  - You are about to drop the column `timelineContent` on the `relationhips` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `relationhips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "relationhips" DROP COLUMN "imageUrls",
DROP COLUMN "timelineContent",
ADD COLUMN     "Plan" "Plans" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "contentDesc" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relationhips" ADD CONSTRAINT "relationhips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "relationhips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
