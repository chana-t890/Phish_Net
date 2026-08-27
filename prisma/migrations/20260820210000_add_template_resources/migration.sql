-- AlterTable
ALTER TABLE "email_templates"
ADD COLUMN "attachments" JSONB,
ADD COLUMN "urls" JSONB;
