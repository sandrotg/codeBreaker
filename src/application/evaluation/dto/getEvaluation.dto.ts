import { ApiProperty } from "@nestjs/swagger";

export class EvaluationResponseDto {
    @ApiProperty({ example: "ccf93e92-3fae-4a40-b9f5-a4b920f04544" })
    evaluationId: string;

    @ApiProperty({ example: "Parcial 1" })
    name: string;

    @ApiProperty({ example: "2025-01-15T10:00:00.000Z" })
    startAt: Date;

    @ApiProperty({ example: 90 })
    durationMinutes: number;

    @ApiProperty({
        example: "activo",
        enum: ["no_disponible", "activo", "no_activo"],
    })
    state: string;

    @ApiProperty({ example: "2025-01-15T11:30:00.000Z" })
    expiresAt: Date;

    @ApiProperty({
        example: 0,
        description: "Milisegundos para que empiece (0 si ya empezó)",
    })
    startsIn: number;
}
