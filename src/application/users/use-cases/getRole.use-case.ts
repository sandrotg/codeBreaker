import { Inject, Injectable } from "@nestjs/common";
import { Role } from "src/domain/users/entities/role.entity";
import type { RoleRepository } from "src/domain/users/repositories/role.repository.port";
import { ROLE_REPOSITORY } from "src/application/tokens";

@Injectable()
export class GetRoleUseCase{
    constructor(
       @Inject(ROLE_REPOSITORY) private readonly roleRepo: RoleRepository
    ){}

    async execute(roleId:string): Promise <Role| null>{
        
        const role = await this.roleRepo.findRoleById(roleId);
        if  (roleId === null){
            throw new Error("roleId not found")
        }

        return role;
    }
}