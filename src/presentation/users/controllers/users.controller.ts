import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from 'src/application/auth/dto/login.dto';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { CreateUserDto } from 'src/application/users/dto/createUser.dto';
import { UpdateUserDto } from 'src/application/users/dto/updateUser.dto';
import { CreateUserUseCase } from 'src/application/users/use-cases/createUser.use-case';
import { GetUserUseCase } from 'src/application/users/use-cases/get-user.use-case';
import { UpdateUserUseCase } from 'src/application/users/use-cases/updateUser.use-case';
import { User } from 'src/domain/users/entities/user.entity';

@Controller("users")
export class UsersController{
  constructor(
    private readonly login: LoginUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly createUser: CreateUserUseCase,
    
  ){}
    
    @Post ("login")
    async Login(@Body() body:LoginDto): Promise<{user:User;token:String}> {
    const result = await this.login.execute(body);
    return {
      user: result.user as User & { userId: number },
      token: result.token
    }
  }
  @Post('/create')
  @ApiOperation({summary:"User Creation"})
  @ApiOkResponse({description: "The user was created correctly "})
  async create(@Body() body: CreateUserDto){
    const user = await this.createUser.execute({
      userName: body.userName,
      password: body.password,
      roleId: body.roleId,
      email: body.email
    })
    return user;
  }

  @Post('/update/:id')
  @ApiOperation({summary:"Update User"})
  @ApiOkResponse({description:"User updated correctly"})

  async update(@Param('id') id: string, @Body() body: UpdateUserDto){
    const updatedUser = await this.updateUser.execute({
      userId: id,
      email: body.email,
      username: body.username,
      password: body.password
    })
    return updatedUser;
  }

  @Get('/:id')
  @ApiOperation({summary: "Find Id"})
  @ApiOkResponse({description:"User Found Correctly"})
  async GetUserById(@Param('id') id: string){
    const user = await this.getUser.execute({
      userId: id,
      criteria: 'id'
    })
    return user
  }

  @ApiOperation({summary:"Find Email"})
  @ApiOkResponse({description:"User Found Correctly"})
  @Get('/email/:email')
  async GetUserByEmail(@Param("email") email: string){
    const user = await this.getUser.execute({
      email: email,
      criteria: 'email'
    })
    return user
  }
}

  

