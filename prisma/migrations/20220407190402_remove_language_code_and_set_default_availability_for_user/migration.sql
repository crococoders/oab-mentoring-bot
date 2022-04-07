/*
  Warnings:

  - You are about to drop the column `language_code` on the `users` table. All the data in the column will be lost.
  - Made the column `availability` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "language_code",
ALTER COLUMN "availability" SET NOT NULL,
ALTER COLUMN "availability" SET DEFAULT E'AVAILABLE';
