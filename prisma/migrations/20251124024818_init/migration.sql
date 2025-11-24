-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateEnum
CREATE TYPE "challengeState" AS ENUM ('Draft', 'Published', 'Archived');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('Python', 'C++', 'Java', 'Node.js');

-- CreateEnum
CREATE TYPE "StatusSubmission" AS ENUM ('QUEUED', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR');

-- CreateEnum
CREATE TYPE "roleName" AS ENUM ('Admin', 'Student');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Role" (
    "roleId" TEXT NOT NULL,
    "name" "roleName" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "Course" (
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nrc" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "group" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "UserCourse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "score" INTEGER,

    CONSTRAINT "UserCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeCourse" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "ChallengeCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationCourse" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "EvaluationCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permissionId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permissionId")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "challengeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "tags" TEXT[],
    "timeLimit" INTEGER NOT NULL,
    "memoryLimit" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "state" "challengeState" NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("challengeId")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "testCaseId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("testCaseId")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submissionId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "status" "StatusSubmission" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER,
    "timeMsTotal" INTEGER,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submissionId")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "inputKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "output" TEXT,
    "error" TEXT,
    "exitCode" INTEGER,
    "executionTime" INTEGER,
    "memoryUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseResult" (
    "caseId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timeMs" INTEGER NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "CaseResult_pkey" PRIMARY KEY ("caseId")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "evaluationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("evaluationId")
);

-- CreateTable
CREATE TABLE "EvaluationChallenge" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,

    CONSTRAINT "EvaluationChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_nrc_key" ON "Course"("nrc");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_userId_courseId_key" ON "UserCourse"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeCourse_challengeId_courseId_key" ON "ChallengeCourse"("challengeId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationCourse_evaluationId_courseId_key" ON "EvaluationCourse"("evaluationId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationChallenge_evaluationId_challengeId_key" ON "EvaluationChallenge"("evaluationId", "challengeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeCourse" ADD CONSTRAINT "ChallengeCourse_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("challengeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeCourse" ADD CONSTRAINT "ChallengeCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCourse" ADD CONSTRAINT "EvaluationCourse_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("evaluationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCourse" ADD CONSTRAINT "EvaluationCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("challengeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("challengeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseResult" ADD CONSTRAINT "CaseResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("submissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationChallenge" ADD CONSTRAINT "EvaluationChallenge_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("evaluationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationChallenge" ADD CONSTRAINT "EvaluationChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("challengeId") ON DELETE RESTRICT ON UPDATE CASCADE;
