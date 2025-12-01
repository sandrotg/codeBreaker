-- DropForeignKey
ALTER TABLE "public"."EvaluationChallenge" DROP CONSTRAINT "EvaluationChallenge_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EvaluationCourse" DROP CONSTRAINT "EvaluationCourse_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EvaluationResult" DROP CONSTRAINT "EvaluationResult_evaluationId_fkey";

-- AddForeignKey
ALTER TABLE "EvaluationCourse" ADD CONSTRAINT "EvaluationCourse_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("evaluationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("evaluationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationChallenge" ADD CONSTRAINT "EvaluationChallenge_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("evaluationId") ON DELETE CASCADE ON UPDATE CASCADE;
