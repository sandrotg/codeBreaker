import { Injectable } from "@nestjs/common";
import type { RoleRepository } from "src/domain/users/repositories/role.repository.port";
import { Role } from "src/domain/users/entities/role.entity";
import { PrismaService } from "src/infrastructure/prisma.service";

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
    constructor (
        private readonly prisma: PrismaService
    ){}

    async save(role: Role): Promise<Role> {
            const saved = await this.prisma.role.create({
                data:{
                  name: role.name 
                }
            });
            return new Role (
                saved.roleId,
                saved.name,
                saved.permissions
            );
    }
    async findRoleById(roleId: string): Promise<Role | null> {
        const role = await this.prisma.role.findUnique({where:{roleId}})
        return role
    }
}