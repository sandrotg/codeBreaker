-- CreateEnum
CREATE TYPE "EvaluationState" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "state" "EvaluationState" NOT NULL DEFAULT 'Inactive';
