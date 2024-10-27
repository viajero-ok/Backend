import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, ValidateIf } from 'class-validator';

export class PoliticasReservaDto {
	@ApiProperty({
		description: 'ID de la política de cancelación',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	id_politica_cancelacion: number;

	@ApiProperty({ description: 'Plazo en días para cancelación', example: 3 })
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	plazo_dias_cancelacion: number;

	@ApiProperty({
		description: 'ID del tipo de pago anticipado',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	id_tipo_pago_anticipado: number;

	@ApiPropertyOptional({
		description: 'Porcentaje de pago anticipado',
		example: 30.5,
	})
	@ValidateIf((o) => o.id_tipo_pago_anticipado === 1)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(100)
	porcentaje_pago_anticipado?: number;
}
