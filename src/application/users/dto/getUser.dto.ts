import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export enum criterias{
  Id = "id",
  Email = "email"
}

export class GetUserDto{

    @ApiProperty({
        description: "Email for searching",
        example: "Email@Email.com"
    })
    @IsString()
    @IsOptional()
    @IsEmail()
    email?:string
    
    
    @ApiProperty({
        description: "Id for Searching",
        example: 1
    })
    @IsString()
    @IsOptional()
    userId?: string
    
    @ApiProperty({
    description: "Password for registration",
    enum: criterias,
    example: criterias.Email,
    })
    
    @IsString()
    @IsNotEmpty()
    criteria: "email"|"id"

    
}