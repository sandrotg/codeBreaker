import { IsString, IsNotEmpty, IsDate, IsNumber, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Difficulty, State } from 'src/domain/challenges/entities/challenges.entity';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Two Sum',
    description: 'Título breve del reto algorítmico.',
  })
  title: string;

  @IsNotEmpty()
  @IsEnum(Difficulty, { message: 'La dificultad debe ser Easy, Medium o Hard.' })
  @ApiProperty({
    enum: Difficulty,
    enumName: 'Difficulty',
    example: Difficulty.EASY,
    description: 'Nivel de dificultad del reto.',
  })
  difficulty: Difficulty;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    example: ['arrays', 'hashmap'],
    description: 'Etiquetas o temas relacionados con el reto.',
  })
  tags: string[];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1500,
    description: 'Límite de tiempo para ejecutar la solución (en milisegundos).',
  })
  timeLimit: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 256,
    description: 'Límite máximo de memoria permitido para la ejecución (en MB).',
  })
  memoryLimit: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Dado un arreglo de enteros y un target, devuelve los índices de los dos números que suman el target.',
    description: 'Descripción detallada del problema y de lo que se espera resolver.',
  })
  description: string;
}