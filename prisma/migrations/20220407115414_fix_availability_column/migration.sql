/*
  Warnings:

  - The values [NOT_AVAILABLE] on the enum `Availability` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Availability_new" AS ENUM ('AVAILABLE', 'UNAVAILABLE');
ALTER TABLE "users" ALTER COLUMN "availability" TYPE "Availability_new" USING ("availability"::text::"Availability_new");
ALTER TYPE "Availability" RENAME TO "Availability_old";
ALTER TYPE "Availability_new" RENAME TO "Availability";
DROP TYPE "Availability_old";
COMMIT;
