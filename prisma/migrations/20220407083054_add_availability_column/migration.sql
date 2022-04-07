-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'NOT_AVAILABLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "availability" "Availability";
