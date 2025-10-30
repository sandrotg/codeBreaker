import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
    
    @ApiProperty({
        description: "Username for registration",
        example: "Username"
    })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({
        description: "Password for registration",
        example: "Password"
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: "RoleId",
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    roleId: string;

    @ApiProperty({
        description: "Email for registration",
        example: "Email@Email.com"
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}