import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'Emails@Email.com', description: 'User email address' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Passwords', description: 'User password' })
    password: string;
}