-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT E'PENDING';
