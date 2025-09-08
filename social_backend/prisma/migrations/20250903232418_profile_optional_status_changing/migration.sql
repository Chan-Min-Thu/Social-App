/*
  Warnings:

  - Made the column `bio` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatarUrl` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `website` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthDate` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "avatarUrl" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "website" SET NOT NULL,
ALTER COLUMN "birthDate" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;
