import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from 'src/application/auth/dto/login.dto';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { CreateUserDto } from 'src/application/users/dto/createUser.dto';
import { UpdateUserDto } from 'src/application/users/dto/updateUser.dto';
import { RefreshTokenDTO } from 'src/application/auth/dto/refresh-token.dto';
import { CreateUserUseCase } from 'src/application/users/use-cases/createUser.use-case';
import { GetUserUseCase } from 'src/application/users/use-cases/get-user.use-case';
import { UpdateUserUseCase } from 'src/application/users/use-cases/updateUser.use-case';
import { RefreshTokenUseCase } from 'src/application/auth/use-cases/refresh-token.use-case';
import { TokenPair } from 'src/domain/auth/token.repository.port';
import { User } from 'src/domain/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/presentation/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/presentation/shared/guards/roles.guard';
import { Roles } from 'src/presentation/shared/decorators/roles.decorator';
import { roleName } from 'src/domain/users/entities/role.entity';
import { GetCoursesByStudentUseCase } from 'src/application/users/use-cases/get-CoursesByStudent.use-case';
@Controller("users")
export class UsersController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly refreshtoken: RefreshTokenUseCase,
    private readonly getCoursesBy: GetCoursesByStudentUseCase
  ) {}


  @Get(":id/cursosdeunusuario")
  async cursosdeunusuario(@Param('id')userId:string){
    return this.getCoursesBy.execute(userId)
  }

  // 🟢 PÚBLICO
  @Post("login")
  async Login(@Body() body: LoginDto) {
    const result = await this.login.execute(body);
    return { user: result.user, token: result.tokens };
  }

  // 🟢 PÚBLICO
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDTO) {
    const result = await this.refreshtoken.execute(body);
    return { user: result.user, token: result.tokens };
  }

  // 🟢 O 🟡 DEPENDE DE TI
  // Si solo admin crea usuarios, agrega Roles y guard.
  // Si quieres registro público, déjalo así.
  @Post('/create')
  async create(@Body() body: CreateUserDto) {
    return this.createUser.execute(body);
  }

  // 🔐 PROTEGIDO
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleName.ADMIN, roleName.STUDENT)
  @Post('/update/:id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.updateUser.execute({
      userId: id,
      email: body.email,
      username: body.username,
      password: body.password
    });
  }

  // 🔐 PROTEGIDO
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleName.STUDENT)
  @ApiBearerAuth()
  @Get('/:id')
  async GetUserById(@Param('id') id: string) {
    return this.getUser.execute({ userId: id, criteria: 'id' });
  }

  // 🔐 PROTEGIDO
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleName.ADMIN)
  @ApiBearerAuth()
  @Get('/email/:email')
  async GetUserByEmail(@Param("email") email: string) {
    return this.getUser.execute({ email, criteria: 'email' });
  }

}



  

