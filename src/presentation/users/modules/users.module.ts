import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { UsersController } from "../controllers/users.controller";
import { TOKEN_SERVICE,USER_REPOSITORY } from "src/application/tokens";
import { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { TokenServicePort } from "src/domain/auth/token.repository.port";

import { PrismaService } from "src/infrastructure/prisma.service";
import { PrismaUserRepository } from "src/infrastructure/users/database/prisma-user.repository";
import { JwtTokenService } from "src/infrastructure/auth/database/prisma-token.repository";


import { LoginUseCase } from "src/application/auth/use-cases/login.use-case";
import { CreateUserUseCase } from "src/application/users/use-cases/createUser.use-case";
import { GetUserUseCase } from "src/application/users/use-cases/get-user.use-case";
import { UpdateUserUseCase } from "src/application/users/use-cases/updateUser.use-case";
import { RefreshTokenUseCase } from "src/application/auth/use-cases/refresh-token.use-case";

@Module({
  imports: [

    // 👇 Usa ConfigService para leer el secret después de cargar el .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,

    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: LoginUseCase,
      useFactory: (repo: UserRepository, token: TokenServicePort) =>
        new LoginUseCase(repo, token),
      inject: [USER_REPOSITORY, TOKEN_SERVICE],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (repo: UserRepository, token: TokenServicePort) =>
        new RefreshTokenUseCase(repo, token),
      inject: [USER_REPOSITORY, TOKEN_SERVICE],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: UserRepository) => new CreateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: GetUserUseCase,
      useFactory: (repo: UserRepository) => new GetUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: UserRepository) => new UpdateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    
  ],
})
export class UsersModule {}