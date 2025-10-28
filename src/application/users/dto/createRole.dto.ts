import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsEnum } from 'class-validator';

export enum RoleName {
  Doctor = 'Doctor',
  Admin = 'Admin',
  Patient = 'Patient',
  Nurse = 'Nurse',
}

export class CreateRoleDto{
@ApiProperty({
    description: "name of the role",
    enum:RoleName,
    example: RoleName.Doctor
})

    @IsString()
    @IsNotEmpty()
    name: 'Admin' | 'Student'

    @IsString()
    @IsOptional()
    permissions?: string | null
}