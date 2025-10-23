import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { LoginDto } from 'src/application/auth/dto/login.dto';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { User } from 'src/domain/users/entities/user.entity';

export class UsersController{
  constructor(
    private readonly login: LoginUseCase
    
  ){}

    @Post ("login")
    async Login(@Body() body:LoginDto): Promise<{user:User;token:String}> {
    const result = await this.login.execute(body);
    return {
      user: result.user as User & { userId: number },
      token: result.token
    }
  }
}