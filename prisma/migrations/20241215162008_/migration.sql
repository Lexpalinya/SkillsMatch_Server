/*
  Warnings:

  - You are about to drop the column `starSalary` on the `SkillJobber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SkillJobber" DROP COLUMN "starSalary",
ADD COLUMN     "startSalary" DOUBLE PRECISION;
