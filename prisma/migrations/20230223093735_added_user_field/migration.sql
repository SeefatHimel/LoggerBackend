/*
  Warnings:

  - Added the required column `userId` to the `Integrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Integrations" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Integrations" ADD CONSTRAINT "Integrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
