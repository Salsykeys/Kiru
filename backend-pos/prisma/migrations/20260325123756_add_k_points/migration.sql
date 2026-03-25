-- AlterTable
ALTER TABLE `customers` ADD COLUMN `points` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `points_earned` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `points_used` DOUBLE NOT NULL DEFAULT 0;
