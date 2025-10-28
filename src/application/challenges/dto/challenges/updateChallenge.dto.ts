import { IsString, IsNotEmpty, IsDate, IsNumber, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty, State } from 'src/domain/challenges/entities/challenges.entity';

export class UpdateChallengeDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    example: 'Two Sum',
    description: 'Título breve del reto algorítmico.',
  })
  title?: string;

  @IsNotEmpty()
  @IsEnum(Difficulty, { message: 'La dificultad debe ser Easy, Medium o Hard.' })
  @ApiPropertyOptional({
    enum: Difficulty,
    enumName: 'Difficulty',
    example: Difficulty.EASY,
    description: 'Nivel de dificultad del reto.',
  })
  difficulty?: Difficulty;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    example: ['arrays', 'hashmap'],
    description: 'Etiquetas o temas relacionados con el reto.',
  })
  tags?: string[];

  @IsNotEmpty()
  @IsNumber()
  @ApiPropertyOptional({
    example: 1500,
    description: 'Límite de tiempo para ejecutar la solución (en milisegundos).',
  })
  timeLimit?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiPropertyOptional({
    example: 256,
    description: 'Límite máximo de memoria permitido para la ejecución (en MB).',
  })
  memoryLimit?: number;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    example: 'Dado un arreglo de enteros y un target, devuelve los índices de los dos números que suman el target.',
    description: 'Descripción detallada del problema y de lo que se espera resolver.',
  })
  description?: string;

  @IsNotEmpty()
  @IsEnum(State, { message: 'El estado debe ser draft, published o archived.' })
  @ApiPropertyOptional({
    enum: State,
    enumName: 'State',
    example: State.DRAFT,
    description: 'Estado actual del reto (borrador, publicado o archivado).',
  })
  state?: State;
}