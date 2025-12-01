import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'eradaa@gmail.com', description: 'User email address' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '12345', description: 'User password' })
    password: string;
}