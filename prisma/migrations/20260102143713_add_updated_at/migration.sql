/*
  Warnings:

  - Added the required column `updatedAt` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT NOW();

-- Fill updatedAt for existing rows
UPDATE "WatchlistItem" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;

ALTER TABLE "Movie" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "WatchlistItem" ALTER COLUMN "updatedAt" DROP DEFAULT;