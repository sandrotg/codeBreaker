import { Role } from "../entities/role.entity";

export interface RoleRepository {
    save(role:Role): Promise<Role>
    findRoleById(roleId:number): Promise <Role | null>;
}