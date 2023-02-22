-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picture" TEXT,
ALTER COLUMN "hash" DROP NOT NULL;
