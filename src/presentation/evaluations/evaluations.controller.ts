import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';
import { CreateEvaluationUseCase } from 'src/application/evaluation/useCases/createEvaluation.useCase';
import { CreateEvaluationDto } from 'src/application/evaluation/dto/createEvaluation.dto';
import { DeleteEvaluationUseCase } from 'src/application/evaluation/useCases/deleteEvaluation.useCase';

@ApiTags("Evaluation")
@Controller("evaluation")
export class EvaluationController {
    constructor(
        private readonly createEvaluation: CreateEvaluationUseCase,
        private readonly deleteEvaluation: DeleteEvaluationUseCase,
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
}