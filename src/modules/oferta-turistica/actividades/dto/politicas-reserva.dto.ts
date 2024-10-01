import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, ValidateIf } from 'class-validator';

export class PoliticasReservaDto {
	@ApiProperty({
		description: 'ID de la política de cancelación',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	id_politica_cancelacion: number;

	@ApiProperty({ description: 'Plazo en días para cancelación', example: 3 })
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	plazo_dias_cancelacion: number;

	@ApiPropertyOptional({
		description: 'Porcentaje de pago anticipado',
		example: 25.5,
	})
	@ValidateIf((o) => o.monto_pago_anticipado === undefined)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(100)
	porcentaje_pago_anticipado?: number;

	@ApiPropertyOptional({
		description: 'Monto de pago anticipado',
		example: 100.5,
	})
	@ValidateIf((o) => o.porcentaje_pago_anticipado === undefined)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	monto_pago_anticipado?: number;
}
