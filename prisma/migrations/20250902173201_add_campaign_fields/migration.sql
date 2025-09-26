/*
  Warnings:

  - The values [MEMBER] on the enum `OrgRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date` on the `Schedule` table. All the data in the column will be lost.
  - The `status` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `channel` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runAt` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ContentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ScheduleStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."Channel" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'TWITTER', 'YOUTUBE', 'LINKEDIN', 'TIKTOK', 'BLOG');

-- CreateEnum
CREATE TYPE "public"."CampaignHealth" AS ENUM ('ON_TRACK', 'AT_RISK', 'OFF_TRACK');

-- CreateEnum
CREATE TYPE "public"."CampaignStatus" AS ENUM ('DRAFT', 'PLANNING', 'READY', 'DONE', 'CANCELED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."OrgRole_new" AS ENUM ('ADMIN', 'BRAND_OWNER', 'CREATOR');
ALTER TABLE "public"."Membership" ALTER COLUMN "role" TYPE "public"."OrgRole_new" USING ("role"::text::"public"."OrgRole_new");
ALTER TYPE "public"."OrgRole" RENAME TO "OrgRole_old";
ALTER TYPE "public"."OrgRole_new" RENAME TO "OrgRole";
DROP TYPE "public"."OrgRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."AnalyticsEvent" ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "contentId" TEXT,
ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "public"."Asset" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "health" "public"."CampaignHealth" NOT NULL DEFAULT 'ON_TRACK',
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" "public"."CampaignStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."Content" ADD COLUMN     "status" "public"."ContentStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."Schedule" DROP COLUMN "date",
ADD COLUMN     "channel" "public"."Channel" NOT NULL,
ADD COLUMN     "contentId" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "runAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
DROP COLUMN "status",
ADD COLUMN     "status" "public"."ScheduleStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "public"."CampaignMember" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMember_campaignId_userId_key" ON "public"."CampaignMember"("campaignId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampaignMember" ADD CONSTRAINT "CampaignMember_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampaignMember" ADD CONSTRAINT "CampaignMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
