/*
  Warnings:

  - Added the required column `isActive` to the `entryExit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `entryExit` ADD COLUMN `isActive` BOOLEAN NOT NULL;
