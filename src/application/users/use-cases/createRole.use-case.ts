import { Inject, Injectable } from "@nestjs/common";
import { Role } from "src/domain/users/entities/role.entity";
import type { RoleRepository } from "src/domain/users/repositories/role.repository.port";
import { CreateRoleDto } from "../dto/createRole.dto";
import { ROLE_REPOSITORY } from "src/application/tokens";
import { randomUUID } from "crypto";

@Injectable()
export class CreateRoleUseCase{
    constructor(
       @Inject(ROLE_REPOSITORY) private readonly roleRepo: RoleRepository
    ){}

    async execute(roleInput: CreateRoleDto ): Promise<Role>{
        const role = new Role(
            randomUUID(),
            roleInput.name,   
        );

        return this.roleRepo.save(role);
    }
}