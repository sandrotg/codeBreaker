import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, OmitType, } from '@nestjs/swagger';
import { CreateTestCaseUseCase } from 'src/application/challenges/useCases/testCases/createTestCase.useCase';
import { DeleteTestCaseUseCase } from 'src/application/challenges/useCases/testCases/deleteTestCase.useCase';
import { FindTestCaseByIdUseCase } from 'src/application/challenges/useCases/testCases/findTestCaseById.seCase';
import { ListTestCasesUseCase } from 'src/application/challenges/useCases/testCases/listTestCases.useCase';
import { UpdateTestCaseUseCase } from 'src/application/challenges/useCases/testCases/updateTestCase.useCase';
import { CreateTestCaseDto } from 'src/application/challenges/dto/testCases/createTestCase.dto';
import { UpdateTestCaseDto } from 'src/application/challenges/dto/testCases/updateTestCase.dto';

@ApiTags("TestCase")
@Controller("testcase")
export class TestCasesController {
    constructor(
        private readonly createTestCase: CreateTestCaseUseCase,
        private readonly deleteTestCase: DeleteTestCaseUseCase,
        private readonly findTestCase: FindTestCaseByIdUseCase,
        private readonly listAllTestCase: ListTestCasesUseCase,
        private readonly updateTestCase: UpdateTestCaseUseCase
    ) { }


    @Post('/create')
    @ApiOperation({ summary: "TestCase Creation" })
    @ApiOkResponse({ description: "The test case was created correctly" })
    async create(@Body() body: CreateTestCaseDto) {
        return await this.createTestCase.execute(body);
    }

    @Delete('/delete/:id')
    @ApiOperation({ summary: "Delete TestCase" })
    @ApiOkResponse({ description: "The Test Case was deleted correctly" })
    async delete(@Param('id') id: string) {
        return await this.deleteTestCase.execute(id);
    }

    @Get("/find/:id")
    @ApiOperation({ summary: "Find TestCase" })
    @ApiOkResponse({ description: "The Test Case is shown correctly" })
    async findTestCaseById(@Param("id") id: string) {
        return await this.findTestCase.execute(id);
    }

    @Get("/list")
    @ApiOperation({ summary: "List all Test Cases" })
    @ApiOkResponse({ description: "Test Cases is shown correctly" })
    async listTestCase() {
        return await this.listAllTestCase.execute();
    }

    @Put("/update/:id")
    @ApiOperation({ summary: "Update Test Case" })
    @ApiOkResponse({ description: "The Test Case was updated correctly" })
    async updateTestCaseById(@Param("id") id: string, @Body() body: UpdateTestCaseDto) {
        return await this.updateTestCase.execute(id, body);
    }
}