/*
  Warnings:

  - The values [CONNECTED] on the enum `NavLocation` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterEnum
BEGIN;
CREATE TYPE "NavLocation_new" AS ENUM ('HEADER', 'BURGER', 'HIDDEN');
ALTER TABLE "Page" ALTER COLUMN "location" DROP DEFAULT;
ALTER TABLE "Page" ALTER COLUMN "location" TYPE "NavLocation_new" USING ("location"::text::"NavLocation_new");
ALTER TYPE "NavLocation" RENAME TO "NavLocation_old";
ALTER TYPE "NavLocation_new" RENAME TO "NavLocation";
DROP TYPE "NavLocation_old";
ALTER TABLE "Page" ALTER COLUMN "location" SET DEFAULT 'HIDDEN';
COMMIT;

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" "MediaType" NOT NULL,
    "authorId" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
