import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { roleName } from 'src/domain/users/entities/role.entity';

export class CreateRoleDto {

  @ApiProperty({
    enum: roleName,
    description: 'Nombre del rol que se desea crear',
    example: 'ADMIN',
  })
  @IsEnum(roleName)
  @IsNotEmpty()
  name: roleName;

  @ApiPropertyOptional({
    description: 'Lista de permisos asociados al rol (opcional)',
    example: 'create_user,delete_user,update_user',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  permissions?: string | null;
}
