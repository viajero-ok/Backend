import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Min,
	Max,
	ValidateNested,
	ValidateIf,
	IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class DatosBasicosDto {
	@ApiProperty({
		description: 'Nombre del alojamiento',
		example: 'Hotel Paraíso',
	})
	@IsNotEmpty()
	@IsString()
	nombre_alojamiento: string;

	@ApiProperty({
		description: 'Descripción del alojamiento',
		example: 'Un hermoso hotel con vista al mar',
	})
	@IsNotEmpty()
	@IsString()
	descripcion_alojamiento: string;
}

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

	@ApiPropertyOptional({
		description: 'Monto de la garantía',
		example: 100.5,
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	monto_garantia?: number;

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

	@ApiPropertyOptional({
		description: 'Mínimo de días de estadía',
		example: 2,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Transform(({ value }) => (value === undefined ? 1 : value))
	minimo_dias_estadia?: number;
}

export class PoliticasReservaYDatosBasicosDto {
	@ApiProperty({ type: DatosBasicosDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => DatosBasicosDto)
	datos_basicos: DatosBasicosDto;

	@ApiProperty({ type: PoliticasReservaDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PoliticasReservaDto)
	politicas_reserva: PoliticasReservaDto;
}
