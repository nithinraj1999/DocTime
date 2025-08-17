-- DropIndex
DROP INDEX "public"."Patient_userId_key";

-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "name" TEXT;
