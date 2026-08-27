-- CreateEnum
CREATE TYPE "TemplateUseMode" AS ENUM ('INSPIRATION', 'DIRECT');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "email_templates"
ADD COLUMN "usageMode" "TemplateUseMode" NOT NULL DEFAULT 'INSPIRATION',
ADD COLUMN "status" "TemplateStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN "createdById" TEXT,
ADD COLUMN "reviewedById" TEXT,
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "adminNotes" TEXT;

-- CreateIndex
CREATE INDEX "email_templates_status_usageMode_idx" ON "email_templates"("status", "usageMode");

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_reviewedById_fkey"
FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "template_expected_flags" (
	"id" TEXT NOT NULL,
	"emailTemplateId" TEXT NOT NULL,
	"text" TEXT NOT NULL,
	"startOffset" INTEGER NOT NULL,
	"endOffset" INTEGER NOT NULL,
	"category" TEXT NOT NULL,
	"zone" TEXT,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,

	CONSTRAINT "template_expected_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_expected_flags_emailTemplateId_idx" ON "template_expected_flags"("emailTemplateId");

-- AddForeignKey
ALTER TABLE "template_expected_flags" ADD CONSTRAINT "template_expected_flags_emailTemplateId_fkey"
FOREIGN KEY ("emailTemplateId") REFERENCES "email_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
