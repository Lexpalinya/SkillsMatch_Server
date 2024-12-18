-- CreateEnum
CREATE TYPE "ECurrency" AS ENUM ('KIP', 'USD', 'THB', 'CNY');

-- CreateEnum
CREATE TYPE "EGender" AS ENUM ('male', 'female', 'transgender');

-- CreateEnum
CREATE TYPE "EUserRole" AS ENUM ('company', 'admin', 'jobber');

-- CreateTable
CREATE TABLE "Users" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile" TEXT,
    "role" "EUserRole" NOT NULL,
    "block" BOOLEAN NOT NULL DEFAULT false,
    "loginVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" SERIAL NOT NULL,
    "userFollowerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyCourse" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facultys" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facultys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationalInstitutions" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationalInstitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationLevels" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationLevels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Languages" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPositions" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessModels" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessModels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOrganinzations" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypeOrganinzations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobber" (
    "id" VARCHAR(36) NOT NULL,
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "gender" "EGender" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "bProvice" TEXT NOT NULL,
    "bDistrict" TEXT NOT NULL,
    "bVillage" TEXT NOT NULL,
    "cProvice" TEXT NOT NULL,
    "cDistrict" TEXT NOT NULL,
    "cVillage" TEXT NOT NULL,
    "docImage" TEXT[],
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillJobber" (
    "id" VARCHAR(36) NOT NULL,
    "userId" TEXT NOT NULL,
    "elId" TEXT NOT NULL,
    "eiId" TEXT NOT NULL,
    "fId" TEXT NOT NULL,
    "scId" TEXT NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "drivingCardType" TEXT NOT NULL,
    "more" TEXT NOT NULL,
    "starSalary" DOUBLE PRECISION NOT NULL,
    "currency" "ECurrency" NOT NULL DEFAULT 'KIP',
    "workDay" TEXT[],
    "checkInTime" TIME NOT NULL,
    "checkOutTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillJobber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillJobberLanguage" (
    "id" SERIAL NOT NULL,
    "sjId" TEXT NOT NULL,
    "lId" TEXT NOT NULL,

    CONSTRAINT "SkillJobberLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillJobberSkills" (
    "id" SERIAL NOT NULL,
    "sjId" TEXT NOT NULL,
    "sId" TEXT NOT NULL,

    CONSTRAINT "SkillJobberSkills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillJobberJobPositions" (
    "id" SERIAL NOT NULL,
    "sjId" TEXT NOT NULL,
    "jpId" TEXT NOT NULL,

    CONSTRAINT "SkillJobberJobPositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
    "id" VARCHAR(36) NOT NULL,
    "userId" TEXT NOT NULL,
    "nameLao" TEXT NOT NULL,
    "nameEng" TEXT NOT NULL,
    "bmId" TEXT NOT NULL,
    "headName" TEXT,
    "toId" TEXT NOT NULL,
    "intarnalOrganization" TEXT NOT NULL,
    "cProvice" TEXT NOT NULL,
    "cDistrict" TEXT NOT NULL,
    "cVillage" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "docImage" TEXT[],
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutCompany" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "cId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" VARCHAR(36) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "cId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "images" TEXT[],
    "endDate" TIMESTAMP(3),
    "startSalary" DOUBLE PRECISION,
    "endSalary" DOUBLE PRECISION,
    "currency" "ECurrency" NOT NULL DEFAULT 'KIP',
    "workDay" TEXT[],
    "checkInTime" TIME NOT NULL,
    "checkOutTime" TIME NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "welfare" TEXT NOT NULL,
    "more" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLanguage" (
    "id" SERIAL NOT NULL,
    "pId" TEXT NOT NULL,
    "lId" TEXT NOT NULL,

    CONSTRAINT "PostLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostStudyCourse" (
    "id" SERIAL NOT NULL,
    "pId" TEXT NOT NULL,
    "scId" TEXT NOT NULL,

    CONSTRAINT "PostStudyCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostEducationalInstitutions" (
    "id" SERIAL NOT NULL,
    "pId" TEXT NOT NULL,
    "eiId" TEXT NOT NULL,

    CONSTRAINT "PostEducationalInstitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostFacul" (
    "id" SERIAL NOT NULL,
    "pId" TEXT NOT NULL,
    "fcId" TEXT NOT NULL,

    CONSTRAINT "PostFacul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostJobPositionsDetails" (
    "id" SERIAL NOT NULL,
    "pId" TEXT NOT NULL,
    "jpId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "detail" TEXT NOT NULL,

    CONSTRAINT "PostJobPositionsDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostJobPositionsDetailsSkills" (
    "id" SERIAL NOT NULL,
    "sId" TEXT NOT NULL,
    "pjpId" INTEGER NOT NULL,

    CONSTRAINT "PostJobPositionsDetailsSkills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikePost" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pId" TEXT NOT NULL,

    CONSTRAINT "LikePost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "follows_userFollowerId_userId_key" ON "follows"("userFollowerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Jobber_userId_key" ON "Jobber"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillJobber_userId_key" ON "SkillJobber"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillJobberLanguage_sjId_lId_key" ON "SkillJobberLanguage"("sjId", "lId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillJobberSkills_sjId_sId_key" ON "SkillJobberSkills"("sjId", "sId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillJobberJobPositions_jpId_sjId_key" ON "SkillJobberJobPositions"("jpId", "sjId");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_userId_key" ON "Companies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLanguage_pId_lId_key" ON "PostLanguage"("pId", "lId");

-- CreateIndex
CREATE UNIQUE INDEX "PostStudyCourse_pId_scId_key" ON "PostStudyCourse"("pId", "scId");

-- CreateIndex
CREATE UNIQUE INDEX "PostEducationalInstitutions_eiId_pId_key" ON "PostEducationalInstitutions"("eiId", "pId");

-- CreateIndex
CREATE UNIQUE INDEX "PostFacul_pId_fcId_key" ON "PostFacul"("pId", "fcId");

-- CreateIndex
CREATE UNIQUE INDEX "PostJobPositionsDetailsSkills_pjpId_sId_key" ON "PostJobPositionsDetailsSkills"("pjpId", "sId");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_userFollowerId_fkey" FOREIGN KEY ("userFollowerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyCourse" ADD CONSTRAINT "StudyCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facultys" ADD CONSTRAINT "Facultys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationalInstitutions" ADD CONSTRAINT "EducationalInstitutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLevels" ADD CONSTRAINT "EducationLevels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Languages" ADD CONSTRAINT "Languages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPositions" ADD CONSTRAINT "JobPositions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessModels" ADD CONSTRAINT "BusinessModels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeOrganinzations" ADD CONSTRAINT "TypeOrganinzations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobber" ADD CONSTRAINT "Jobber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobber" ADD CONSTRAINT "SkillJobber_elId_fkey" FOREIGN KEY ("elId") REFERENCES "EducationLevels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobber" ADD CONSTRAINT "SkillJobber_eiId_fkey" FOREIGN KEY ("eiId") REFERENCES "EducationalInstitutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobber" ADD CONSTRAINT "SkillJobber_fId_fkey" FOREIGN KEY ("fId") REFERENCES "Facultys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobber" ADD CONSTRAINT "SkillJobber_scId_fkey" FOREIGN KEY ("scId") REFERENCES "StudyCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobber" ADD CONSTRAINT "SkillJobber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobberLanguage" ADD CONSTRAINT "SkillJobberLanguage_sjId_fkey" FOREIGN KEY ("sjId") REFERENCES "SkillJobber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobberLanguage" ADD CONSTRAINT "SkillJobberLanguage_lId_fkey" FOREIGN KEY ("lId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobberSkills" ADD CONSTRAINT "SkillJobberSkills_sjId_fkey" FOREIGN KEY ("sjId") REFERENCES "SkillJobber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobberSkills" ADD CONSTRAINT "SkillJobberSkills_sId_fkey" FOREIGN KEY ("sId") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobberJobPositions" ADD CONSTRAINT "SkillJobberJobPositions_sjId_fkey" FOREIGN KEY ("sjId") REFERENCES "SkillJobber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillJobberJobPositions" ADD CONSTRAINT "SkillJobberJobPositions_jpId_fkey" FOREIGN KEY ("jpId") REFERENCES "JobPositions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_bmId_fkey" FOREIGN KEY ("bmId") REFERENCES "BusinessModels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_toId_fkey" FOREIGN KEY ("toId") REFERENCES "TypeOrganinzations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutCompany" ADD CONSTRAINT "AboutCompany_cId_fkey" FOREIGN KEY ("cId") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_cId_fkey" FOREIGN KEY ("cId") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLanguage" ADD CONSTRAINT "PostLanguage_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLanguage" ADD CONSTRAINT "PostLanguage_lId_fkey" FOREIGN KEY ("lId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostStudyCourse" ADD CONSTRAINT "PostStudyCourse_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostStudyCourse" ADD CONSTRAINT "PostStudyCourse_scId_fkey" FOREIGN KEY ("scId") REFERENCES "StudyCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEducationalInstitutions" ADD CONSTRAINT "PostEducationalInstitutions_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEducationalInstitutions" ADD CONSTRAINT "PostEducationalInstitutions_eiId_fkey" FOREIGN KEY ("eiId") REFERENCES "EducationalInstitutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFacul" ADD CONSTRAINT "PostFacul_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFacul" ADD CONSTRAINT "PostFacul_fcId_fkey" FOREIGN KEY ("fcId") REFERENCES "Facultys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostJobPositionsDetails" ADD CONSTRAINT "PostJobPositionsDetails_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostJobPositionsDetails" ADD CONSTRAINT "PostJobPositionsDetails_jpId_fkey" FOREIGN KEY ("jpId") REFERENCES "JobPositions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostJobPositionsDetailsSkills" ADD CONSTRAINT "PostJobPositionsDetailsSkills_sId_fkey" FOREIGN KEY ("sId") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostJobPositionsDetailsSkills" ADD CONSTRAINT "PostJobPositionsDetailsSkills_pjpId_fkey" FOREIGN KEY ("pjpId") REFERENCES "PostJobPositionsDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikePost" ADD CONSTRAINT "LikePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikePost" ADD CONSTRAINT "LikePost_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
