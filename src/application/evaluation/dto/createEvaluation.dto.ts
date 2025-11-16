import { IsString, IsNotEmpty, IsNumber, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEvaluationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: ' Parcial 1 - Estructuras de Datos',
    description: 'Título de la evaluacion.',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '15 de octubre, 10:00 a.m.',
    description: 'Fecha y hora limite de la evaluacion.',
  })
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '60',
    description: 'Duracion de la evaluacion en minutos.',
  })
  duration: number;

  @IsArray()
  @ApiProperty({
        type: [String],
        example: [
            "795bbea2-8939-46c9-906c-92505b7f7f2c",
            "d4584c76-b9b6-4b51-847d-3d36fdba9d90"
        ]
    })
    challengeIds: string[];
}