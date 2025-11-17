import { Role } from "../entities/role.entity";

export interface RoleRepository {
    save(role:Role): Promise<Role>
    findRoleById(roleId:string): Promise <Role | null>;
}