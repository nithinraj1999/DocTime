/*
  Warnings:

  - You are about to drop the column `name` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `patientName` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "name",
ADD COLUMN     "patientName" TEXT NOT NULL;
