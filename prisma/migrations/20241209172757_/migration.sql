/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Users` table. All the data in the column will be lost.
  - Changed the type of `birthday` on the `Jobber` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobber" DROP COLUMN "birthday",
ADD COLUMN     "birthday" DATE NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
