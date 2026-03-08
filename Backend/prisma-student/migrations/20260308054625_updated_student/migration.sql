/*
  Warnings:

  - You are about to drop the column `aadharCardNumber` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "aadharCardNumber",
DROP COLUMN "profilePic",
ADD COLUMN     "expoToken" TEXT;
