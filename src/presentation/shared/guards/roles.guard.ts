import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLE_REPOSITORY } from 'src/application/tokens';
import type { RoleRepository } from 'src/domain/users/repositories/role.repository.port';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: RoleRepository, // <-- CONSULTA LA BASE DE DATOS
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si el endpoint no requiere roles
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('User not authenticated');

    const userRoleId = user.roleId;

    if (!userRoleId) {
      throw new ForbiddenException('User token does not contain roleId');
    }

    // 🔥 CONSULTAR EL ROL EN LA BD
    const role = await this.roleRepo.findRoleById(userRoleId);

    if (!role) {
      throw new ForbiddenException('Role not found in database');
    }

    // role.name es tu enum (Admin o Student)
    const userRoleName = role.name;

    // Comparar por nombres de rol
    const hasRole = requiredRoles.includes(userRoleName);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}

