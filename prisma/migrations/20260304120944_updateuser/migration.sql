-- CreateEnum
CREATE TYPE "TOP" AS ENUM ('TOP1', 'TOP2', 'TOP3');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "needsPasswordChange" BOOLEAN NOT NULL DEFAULT false;
