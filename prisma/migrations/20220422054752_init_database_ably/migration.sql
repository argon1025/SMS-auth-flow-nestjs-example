-- CreateTable
CREATE TABLE `Customers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(20) NULL,
    `nickname` VARCHAR(15) NULL,
    `name` VARCHAR(15) NULL,
    `password` VARCHAR(150) NULL,
    `joinedAt` DATE NULL,
    `createdAt` DATE NULL,
    `deletedAt` DATE NULL,

    UNIQUE INDEX `Customers_phone_key`(`phone`),
    UNIQUE INDEX `Customers_nickname_key`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
