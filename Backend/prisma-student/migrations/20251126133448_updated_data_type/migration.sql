/*
  Warnings:

  - The `enrolledAt` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `expiresAt` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "enrolledAt",
ADD COLUMN     "enrolledAt" INTEGER,
DROP COLUMN "expiresAt",
ADD COLUMN     "expiresAt" INTEGER;
