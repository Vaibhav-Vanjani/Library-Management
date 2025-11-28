-- CreateTable
CREATE TABLE `entryExit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `entryTime` VARCHAR(191) NOT NULL,
    `exitTime` VARCHAR(191) NOT NULL,
    `currentDate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
