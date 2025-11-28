/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `entryExit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `entryExit_userId_key` ON `entryExit`(`userId`);
