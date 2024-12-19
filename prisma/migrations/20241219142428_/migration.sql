-- DropForeignKey
ALTER TABLE "PostJobPositionsDetailsSkills" DROP CONSTRAINT "PostJobPositionsDetailsSkills_pjpId_fkey";

-- AddForeignKey
ALTER TABLE "PostJobPositionsDetailsSkills" ADD CONSTRAINT "PostJobPositionsDetailsSkills_pjpId_fkey" FOREIGN KEY ("pjpId") REFERENCES "PostJobPositionsDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
