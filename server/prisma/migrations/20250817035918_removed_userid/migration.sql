/*
  Warnings:

  - You are about to drop the column `userId` on the `Doctor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Doctor_userId_key";

-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "userId";
