/*
  Warnings:

  - You are about to drop the column `fcId` on the `PostFacultys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pId,fId]` on the table `PostFacultys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fId` to the `PostFacultys` table without a default value. This is not possible if the table is not empty.
  - Made the column `gpa` on table `Posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PostFacultys" DROP CONSTRAINT "PostFacultys_fcId_fkey";

-- DropIndex
DROP INDEX "PostFacultys_pId_fcId_key";

-- AlterTable
ALTER TABLE "PostFacultys" DROP COLUMN "fcId",
ADD COLUMN     "fId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ALTER COLUMN "gpa" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PostFacultys_pId_fId_key" ON "PostFacultys"("pId", "fId");

-- AddForeignKey
ALTER TABLE "PostFacultys" ADD CONSTRAINT "PostFacultys_fId_fkey" FOREIGN KEY ("fId") REFERENCES "Facultys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
