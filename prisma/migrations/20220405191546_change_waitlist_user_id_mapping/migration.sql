/*
  Warnings:

  - You are about to drop the column `userId` on the `wait_list` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `wait_list` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "wait_list" DROP CONSTRAINT "wait_list_userId_fkey";

-- AlterTable
ALTER TABLE "wait_list" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "wait_list" ADD CONSTRAINT "wait_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
