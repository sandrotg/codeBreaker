import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SubmissionLanguage } from "src/domain/submissions/entities/submission.entity";
import { ApiProperty } from "@nestjs/swagger";


export class CreateSubmissionDto {

    @ApiProperty({ example: "Dunord Ortega", description: "User name" })
    @IsString()
    @IsNotEmpty()
    user: string;

    @ApiProperty({ example: "795bbea2-8939-46c9-906c-92505b7f7f2c", description: "Challenge identifier" })
    @IsString()
    @IsNotEmpty()
    challengeId: string;

    @ApiProperty({
        enum: SubmissionLanguage,
        description: 'Language. Valid options are: Python, C++, Java, Node.js',
        example: SubmissionLanguage.Python
    })
    @IsEnum(SubmissionLanguage, {
        message: 'invalid lenguage. Valid options are: Python, C++, Java, Node.js'
    })
    @IsNotEmpty()
    lenguage: SubmissionLanguage;

}