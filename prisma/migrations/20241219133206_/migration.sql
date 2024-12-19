/*
  Warnings:

  - A unique constraint covering the columns `[pId,jpId]` on the table `PostJobPositionsDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostJobPositionsDetails_pId_jpId_key" ON "PostJobPositionsDetails"("pId", "jpId");
