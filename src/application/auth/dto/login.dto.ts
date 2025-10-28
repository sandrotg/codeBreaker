import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'password123456', description: 'User password' })
    password: string;
}