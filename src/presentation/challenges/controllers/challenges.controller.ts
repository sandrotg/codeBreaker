import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';
import { CreateChallengeUseCase } from 'src/application/challenges/useCases/challenges/createChallenge.useCase';
import { DeleteChallengeUseCase } from 'src/application/challenges/useCases/challenges/deleteChallenge.useCase';
import { findChallengeByIdUseCase } from 'src/application/challenges/useCases/challenges/findChallengeById.useCase';
import { ListChallengesUseCase } from 'src/application/challenges/useCases/challenges/listChallenges.useCase';
import { ListTestCasesByChallengeIdUseCase } from 'src/application/challenges/useCases/challenges/listTestCasesByChallengeId.useCase';
import { UpdateChallengeUseCase } from 'src/application/challenges/useCases/challenges/updateChallenge.useCase';
import { CreateChallengeDto } from 'src/application/challenges/dto/challenges/createChallenge.dto';
import { UpdateChallengeDto } from 'src/application/challenges/dto/challenges/updateChallenge.dto';

@ApiTags("Challenge")
@Controller("challenge")
export class ChallengeController {
    constructor(
        private readonly createChallenge: CreateChallengeUseCase,
        private readonly deleteChallenge: DeleteChallengeUseCase,
        private readonly findChallenge: findChallengeByIdUseCase,
        private readonly listAllChallenges: ListChallengesUseCase,
        private readonly listTestCasesByChallenge: ListTestCasesByChallengeIdUseCase,
        private readonly updateChallenge: UpdateChallengeUseCase
    ) { }


    @Post('/create')
    @ApiOperation({ summary: "Challenge Creation" })
    @ApiOkResponse({ description: "The challenge was created correctly" })
    async create(@Body() body: CreateChallengeDto) {
        return await this.createChallenge.execute(body);
    }

    @Delete('/delete/:id')
    @ApiOperation({ summary: "Delete Challenge" })
    @ApiOkResponse({ description: "The challenge was deleted correctly" })
    async delete(@Param('id') id: string) {
        return await this.deleteChallenge.execute(id);
    }

    @Get("/find/:id")
    @ApiOperation({ summary: "Find Challenge" })
    @ApiOkResponse({ description: "The challenge is shown correctly" })
    async findchallengeById(@Param("id") id: string) {
        return await this.findChallenge.execute(id);
    }

    @Get("/list")
    @ApiOperation({ summary: "List all Challenges" })
    @ApiOkResponse({ description: "Challenges is shown correctly" })
    async listChallenges() {
        return await this.listAllChallenges.execute();
    }

    @Get("/:id/testcases")
    @ApiOperation({ summary: "List testCases" })
    @ApiOkResponse({ description: "TestCases is shown correctly" })
    async listTestCasesByChallengeId(@Param("id") id: string) {
        return await this.listTestCasesByChallenge.execute(id);
    }

    @Put("/update/:id")
    @ApiOperation({ summary: "Update Challenge" })
    @ApiOkResponse({ description: "The challenge was updated correctly" })
    async updateChallengeById(@Param("id") id: string, @Body() body: UpdateChallengeDto) {
        return await this.updateChallenge.execute(id, body);
    }
}