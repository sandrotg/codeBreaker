import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';
import { CreateEvaluationUseCase } from 'src/application/evaluation/useCases/createEvaluation.useCase';
import { CreateEvaluationDto } from 'src/application/evaluation/dto/createEvaluation.dto';
import { DeleteEvaluationUseCase } from 'src/application/evaluation/useCases/deleteEvaluation.useCase';
import { EvaluationResponseDto } from 'src/application/evaluation/dto/getEvaluation.dto';
import { GetEvaluationUseCase } from 'src/application/evaluation/useCases/getEvaluationUseCase';
import { FindAllEvaluationsUseCase } from 'src/application/evaluation/useCases/findAllEvaluations.useCase';
import { GetAllChallengesInEvaluationUseCase } from 'src/application/evaluation/useCases/get-all-challenges.usecase';
import { UpdateEvaluationStateUseCase } from 'src/application/evaluation/useCases/updateEvaluationState.useCase';
import { GetActiveEvaluationsByStudentUseCase } from 'src/application/evaluation/useCases/getActiveEvaluationsByStudent.useCase';
import { CreateEvaluationResultUseCase } from 'src/application/evaluation/useCases/createEvaluationResult.useCase';
import { UpdateEvaluationResultUseCase } from 'src/application/evaluation/useCases/updateEvaluationResult.useCase';
import { GetResultsByEvaluationUseCase } from 'src/application/evaluation/useCases/getResultsByEvaluation.useCase';
import { GetResultByUserAndEvaluationUseCase } from 'src/application/evaluation/useCases/getResultByUserAndEvaluation.useCase';
import { DeleteEvaluationResultUseCase } from 'src/application/evaluation/useCases/deleteEvaluationResult.useCase';
import { EvaluationState } from 'src/domain/evaluations/entities/evaluation.entity';

@ApiTags("Evaluation")
@Controller("evaluation")
export class EvaluationController {
    constructor(
        private readonly createEvaluation: CreateEvaluationUseCase,
        private readonly deleteEvaluation: DeleteEvaluationUseCase,
        private readonly GetEvaluationUseCase: GetEvaluationUseCase,
        private readonly FindAllEvaluationsUseCase: FindAllEvaluationsUseCase,
        private readonly getChallengesInEvaluationUseCase: GetAllChallengesInEvaluationUseCase,
        private readonly updateEvaluationStateUseCase: UpdateEvaluationStateUseCase,
        private readonly getActiveEvaluationsByStudentUseCase: GetActiveEvaluationsByStudentUseCase,
        private readonly createEvaluationResultUseCase: CreateEvaluationResultUseCase,
        private readonly updateEvaluationResultUseCase: UpdateEvaluationResultUseCase,
        private readonly getResultsByEvaluationUseCase: GetResultsByEvaluationUseCase,
        private readonly getResultByUserAndEvaluationUseCase: GetResultByUserAndEvaluationUseCase,
        private readonly deleteEvaluationResultUseCase: DeleteEvaluationResultUseCase
    ) { }

    @Post('/create')
    @ApiOperation({ summary: "Evaluation Creation" })
    @ApiOkResponse({ description: "The evaluation was created correctly" })
    async create(@Body() body: CreateEvaluationDto) {
        return await this.createEvaluation.execute(body);
    }

    @Delete('/delete/:id')
    @ApiOperation({ summary: "Delete Evaluation" })
    @ApiOkResponse({ description: "The evaluation was deleted correctly" })
    async delete(@Param('id') id: string) {
        return await this.deleteEvaluation.execute(id);
    }

    @Get(':id')
    @ApiOperation({ summary: "Get evaluation by ID" })
    @ApiOkResponse({ type: EvaluationResponseDto })
    async getEvaluation(@Param('id') id: string) {
        return this.GetEvaluationUseCase.execute(id);
    }

    @Get('/')
    @ApiOperation({ summary: "Get all evaluations" })
    @ApiOkResponse({ type: [EvaluationResponseDto] })
    async findAllEvaluations() {
        return this.FindAllEvaluationsUseCase.execute();
    }
    
    @Get('/challenges/:id')
    @ApiOperation({ summary: "Get challenges in evaluation by ID" })
    @ApiOkResponse({ description: "List of challenges retrieved successfully." })
    async getChallengesInEvaluation(@Param('id') id: string) {
        return this.getChallengesInEvaluationUseCase.execute(id);
    }

    @Patch('/activate/:id')
    @ApiOperation({ summary: "Activate Evaluation" })
    @ApiOkResponse({ description: "The evaluation was activated correctly" })
    async activateEvaluation(@Param('id') id: string) {
        await this.updateEvaluationStateUseCase.execute(id, EvaluationState.ACTIVE);
        return { message: 'Evaluation activated successfully' };
    }

    @Patch('/deactivate/:id')
    @ApiOperation({ summary: "Deactivate Evaluation" })
    @ApiOkResponse({ description: "The evaluation was deactivated correctly" })
    async deactivateEvaluation(@Param('id') id: string) {
        await this.updateEvaluationStateUseCase.execute(id, EvaluationState.INACTIVE);
        return { message: 'Evaluation deactivated successfully' };
    }

    @Get('/student/:userId')
    @ApiOperation({ summary: "Get active evaluations for a student" })
    @ApiOkResponse({ description: "List of active evaluations for the student" })
    async getActiveEvaluationsByStudent(@Param('userId') userId: string) {
        return this.getActiveEvaluationsByStudentUseCase.execute(userId);
    }

    @Post('/results')
    @ApiOperation({ summary: "Create evaluation result when student starts" })
    @ApiOkResponse({ description: "Evaluation result created successfully" })
    async createResult(@Body() body: { evaluationId: string; userId: string; totalChallenges: number }) {
        return this.createEvaluationResultUseCase.execute(
            body.evaluationId,
            body.userId,
            body.totalChallenges
        );
    }

    @Patch('/results/:resultId')
    @ApiOperation({ summary: "Update evaluation result when student finishes" })
    @ApiOkResponse({ description: "Evaluation result updated successfully" })
    async updateResult(
        @Param('resultId') resultId: string,
        @Body() body: { submissionIds: string[]; score: number }
    ) {
        return this.updateEvaluationResultUseCase.execute(
            resultId,
            body.submissionIds,
            body.score
        );
    }

    @Get('/results/:evaluationId')
    @ApiOperation({ summary: "Get all results for an evaluation" })
    @ApiOkResponse({ description: "List of results for the evaluation" })
    async getResultsByEvaluation(@Param('evaluationId') evaluationId: string) {
        return this.getResultsByEvaluationUseCase.execute(evaluationId);
    }

    @Get('/results/:evaluationId/user/:userId')
    @ApiOperation({ summary: "Get result for specific user and evaluation" })
    @ApiOkResponse({ description: "Result for the user in the evaluation" })
    async getResultByUserAndEvaluation(
        @Param('evaluationId') evaluationId: string,
        @Param('userId') userId: string
    ) {
        return this.getResultByUserAndEvaluationUseCase.execute(evaluationId, userId);
    }

    @Delete('/results/:resultId')
    @ApiOperation({ summary: "Reset evaluation result for a specific student" })
    @ApiOkResponse({ description: "Evaluation result deleted successfully" })
    async deleteResult(@Param('resultId') resultId: string) {
        await this.deleteEvaluationResultUseCase.execute(resultId);
        return { message: 'Evaluation result reset successfully' };
    }

}