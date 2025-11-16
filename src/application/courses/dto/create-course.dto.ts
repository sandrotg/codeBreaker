import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class createCourseDto {

    @IsNotEmpty()
    @IsString()
    creatorEmail: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsInt()
    nrc: number;

    @IsNotEmpty()
    @IsString()
    period: string;

    @IsNotEmpty()
    @IsInt()
    group: number;
}