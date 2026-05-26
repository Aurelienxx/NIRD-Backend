/*
  Warnings:

  - The values [BLOG] on the enum `PageType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `_PageToRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_RoleToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_PageToRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_RoleToUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "NavLocation" ADD VALUE 'CONNECTED';

-- AlterEnum
BEGIN;
CREATE TYPE "PageType_new" AS ENUM ('SIMPLE', 'ARTICLE', 'ANNONCES', 'DOCUMENTS');
ALTER TABLE "Page" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Page" ALTER COLUMN "type" TYPE "PageType_new" USING ("type"::text::"PageType_new");
ALTER TYPE "PageType" RENAME TO "PageType_old";
ALTER TYPE "PageType_new" RENAME TO "PageType";
DROP TYPE "PageType_old";
ALTER TABLE "Page" ALTER COLUMN "type" SET DEFAULT 'SIMPLE';
COMMIT;

-- AlterTable
ALTER TABLE "_PageToRole" DROP CONSTRAINT "_PageToRole_AB_pkey";

-- AlterTable
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_PageToRole_AB_unique" ON "_PageToRole"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");
