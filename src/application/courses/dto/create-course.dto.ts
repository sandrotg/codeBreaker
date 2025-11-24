import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class createCourseDto {

    @ApiProperty({
        example: "usuario@ejemplo.com",
        description: "Correo del profesor del curso",
    })
    @IsNotEmpty()
    @IsString()
    creatorEmail: string;

    @ApiProperty({
        example: "Programación Web",
        description: "Título del curso",
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        example: 9261,
        description: "NRC del curso",
    })
    @IsNotEmpty()
    @IsInt()
    nrc: number;

    @ApiProperty({
        example: "2025-2",
        description: "Periodo académico",
    })
    @IsNotEmpty()
    @IsString()
    period: string;

    @ApiProperty({
        example: 2,
        description: "Número de grupo del curso",
    })
    @IsNotEmpty()
    @IsInt()
    group: number;
}
