/*
  Warnings:

  - You are about to drop the column `userId` on the `Place` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[placeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_userId_fkey";

-- DropIndex
DROP INDEX "Place_userId_key";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "placeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_placeId_key" ON "User"("placeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
