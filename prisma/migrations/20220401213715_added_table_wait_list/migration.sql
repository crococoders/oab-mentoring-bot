/*
  Warnings:

  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `years_of_experience` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Specialization" AS ENUM ('BACKEND', 'FRONTEND', 'MOBILE', 'QA', 'DATASCIENCE', 'DESIGN', 'MANAGEMENT');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('MENTOR', 'MENTEE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "specialization" "Specialization" NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL,
ADD COLUMN     "years_of_experience" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "wait_list" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "wait_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wait_list" ADD CONSTRAINT "wait_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
