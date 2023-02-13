/*
  Warnings:

  - You are about to drop the `TimeEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "Labels" AS ENUM ('BUG', 'FEATURE', 'REFACTOR');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('STARTED', 'STOPPED');

-- DropForeignKey
ALTER TABLE "TimeEntry" DROP CONSTRAINT "TimeEntry_taskId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "due" TIMESTAMP(3),
ADD COLUMN     "estimation" INTEGER,
ADD COLUMN     "labels" "Labels"[],
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'TODO';

-- DropTable
DROP TABLE "TimeEntry";

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "SessionStatus" NOT NULL DEFAULT 'STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
