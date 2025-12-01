import { IsString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTestCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    example: '643f1b2c8f1b2c001c9e4b8a',
    description: 'Identificador único del reto al que pertenece este caso de prueba.',
  })
  challengeId?: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    example: '4\n2 7 11 15\n9\n',
    description: 'Entrada que se le pasará al programa del estudiante durante la evaluación.',
  })
  input?: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    example: '0 1\n',
    description: 'Salida esperada que debe producir el programa para que el caso se considere correcto.',
  })
  output?: string;
}
