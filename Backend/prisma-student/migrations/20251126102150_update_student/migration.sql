-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "enrolledAt" TEXT,
ADD COLUMN     "expiresAt" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT;
