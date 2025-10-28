import { Module } from "@nestjs/common";
import { RolesController } from "../controllers/roles.controller";
import { ROLE_REPOSITORY } from "src/application/tokens";
import { RoleRepository } from "src/domain/users/repositories/role.repository.port";
import { CreateRoleUseCase } from "src/application/users/use-cases/createRole.use-case";
import { GetRoleUseCase } from "src/application/users/use-cases/getRole.use-case";
import { PrismaService } from "src/infrastructure/users/database/prisma.service";
import { PrismaRoleRepository } from "src/infrastructure/users/database/prisma-role.repository";


@Module({
    controllers: [RolesController],
    providers: [

        PrismaService,

         {
            provide:ROLE_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaRoleRepository(prisma),
            inject: [PrismaService],
        },

        {
            provide: CreateRoleUseCase,
            useFactory: (repo:RoleRepository) => new CreateRoleUseCase(repo),
            inject: [ROLE_REPOSITORY]
        },       
        {
            provide: GetRoleUseCase,
            useFactory: (repo:RoleRepository) => new GetRoleUseCase(repo),
            inject: [ROLE_REPOSITORY]
        }
    ]
})
export class RolesModule{}