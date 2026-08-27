-- AlterTable
ALTER TABLE "training_assignments"
ADD COLUMN "templateId" TEXT;

-- CreateIndex
CREATE INDEX "training_assignments_templateId_idx" ON "training_assignments"("templateId");

-- AddForeignKey
ALTER TABLE "training_assignments" ADD CONSTRAINT "training_assignments_templateId_fkey"
FOREIGN KEY ("templateId") REFERENCES "email_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
