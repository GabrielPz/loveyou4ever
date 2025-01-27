/*
  Warnings:

  - You are about to drop the column `correct_awser` on the `questions` table. All the data in the column will be lost.
  - Added the required column `correctAwser` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_category_id_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "correct_awser",
ADD COLUMN     "correctAwser" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
