/*
  Warnings:

  - You are about to drop the `PostFacul` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostFacul" DROP CONSTRAINT "PostFacul_fcId_fkey";

-- DropForeignKey
ALTER TABLE "PostFacul" DROP CONSTRAINT "PostFacul_pId_fkey";

-- DropTable
DROP TABLE "PostFacul";

-- CreateTable
CREATE TABLE "PostFacultys" (
    "id" SERIAL NOT NULL,
    "pId" TEXT NOT NULL,
    "fcId" TEXT NOT NULL,

    CONSTRAINT "PostFacultys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostFacultys_pId_fcId_key" ON "PostFacultys"("pId", "fcId");

-- AddForeignKey
ALTER TABLE "PostFacultys" ADD CONSTRAINT "PostFacultys_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFacultys" ADD CONSTRAINT "PostFacultys_fcId_fkey" FOREIGN KEY ("fcId") REFERENCES "Facultys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
