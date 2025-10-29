import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateRoleDto } from 'src/application/users/dto/createRole.dto';
import { CreateRoleUseCase } from 'src/application/users/use-cases/createRole.use-case';
import { GetRoleUseCase } from 'src/application/users/use-cases/getRole.use-case';
import {ApiBody,ApiCreatedResponse,ApiOkResponse,ApiOperation,ApiParam,ApiQuery,ApiTags,} from '@nestjs/swagger';   

@ApiTags("Roles")
@Controller ("roles")
export class RolesController{
    constructor(
        private readonly createRole: CreateRoleUseCase,
        private readonly getRole: GetRoleUseCase
    ){}
    

    @Post('/create')
    @ApiOperation({summary:"Role Creation"})
    @ApiOkResponse({description:"the role was created correctly"})
    async create(@Body() body:CreateRoleDto){
        const role = await this.createRole.execute({
            name: body.name
        })
        return role;
    
}

    @Get ("/find/:id")
    @ApiOperation({summary: "Find Role"})
    @ApiOkResponse({description: "The user is shown correctly"})
    async findRoleById(@Param("id") id:string){
        const role = await this.getRole.execute(id)
        return role
    }
}