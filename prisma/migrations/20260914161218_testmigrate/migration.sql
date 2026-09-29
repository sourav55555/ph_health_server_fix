/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `followUpDate` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `medical_reports` table. All the data in the column will be lost.
  - Added the required column `reportLink` to the `medical_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportName` to the `medical_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_patientId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialty" DROP CONSTRAINT "doctor_specialty_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_doctorId_fkey";

-- DropIndex
DROP INDEX "doctor_id_key";

-- DropIndex
DROP INDEX "medical_reports_appointmentId_key";

-- AlterTable
ALTER TABLE "doctor" ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "profilePhoto" SET DATA TYPE TEXT,
ALTER COLUMN "contactNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "medical_reports" DROP COLUMN "appointmentId",
DROP COLUMN "diagnosis",
DROP COLUMN "doctorId",
DROP COLUMN "followUpDate",
DROP COLUMN "treatment",
ADD COLUMN     "reportLink" TEXT NOT NULL,
ADD COLUMN     "reportName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialty" ADD CONSTRAINT "doctor_specialty_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id");

-- RenameIndex
ALTER INDEX "doctor_email_idx" RENAME TO "idx_doctor_email";

-- RenameIndex
ALTER INDEX "doctor_isDeleted_idx" RENAME TO "idx_doctor_isDeleted";
