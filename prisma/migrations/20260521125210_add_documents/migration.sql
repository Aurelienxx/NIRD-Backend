-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('TUTORIEL', 'GUIDE', 'LETTRE');

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "mediaType" SET DEFAULT 'IMAGE';

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileData" BYTEA NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "tags" "Tag"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
