/*
  Warnings:

  - The primary key for the `Integrations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Integrations" DROP CONSTRAINT "Integrations_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Integrations_pkey" PRIMARY KEY ("id");
