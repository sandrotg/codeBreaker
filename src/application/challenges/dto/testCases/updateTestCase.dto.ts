import { IsString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTestCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    example: '7f89c2e4-1b2a-4b3e-9a67-ec12f1f4a8cd',
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
