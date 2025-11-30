-- CreateTable
CREATE TABLE "EvaluationResult" (
    "resultId" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submissionIds" TEXT[],
    "score" DOUBLE PRECISION,
    "totalChallenges" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "EvaluationResult_pkey" PRIMARY KEY ("resultId")
);

-- CreateIndex
CREATE INDEX "EvaluationResult_evaluationId_idx" ON "EvaluationResult"("evaluationId");

-- CreateIndex
CREATE INDEX "EvaluationResult_userId_idx" ON "EvaluationResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationResult_evaluationId_userId_key" ON "EvaluationResult"("evaluationId", "userId");

-- AddForeignKey
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("evaluationId") ON DELETE RESTRICT ON UPDATE CASCADE;
