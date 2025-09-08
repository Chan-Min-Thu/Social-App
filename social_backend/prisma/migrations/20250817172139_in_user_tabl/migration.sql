-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'FREEZE', 'BLOCK');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE';
