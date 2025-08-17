-- AlterTable
ALTER TABLE "public"."Doctor" ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE';
