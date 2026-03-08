/*
  Warnings:

  - A unique constraint covering the columns `[invoice]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `snap_token` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'success',
    MODIFY `cashier_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `transactions_invoice_key` ON `transactions`(`invoice`);
