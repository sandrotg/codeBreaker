import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsEnum } from 'class-validator';
import { roleName } from 'src/domain/users/entities/role.entity';


export class CreateRoleDto{

    @IsEnum(roleName)
    @IsNotEmpty()
    name: roleName

    @IsString()
    @IsOptional()
    permissions?: string | null
}