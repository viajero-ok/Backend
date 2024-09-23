import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Min,
	Max,
	IsBoolean,
	ValidateNested,
	ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DatosBasicosDto {
	@ApiProperty({ description: 'ID del tipo de oferta', example: 1 })
	@IsNotEmpty()
	@IsNumber()
	id_tipo_oferta: number;

	@ApiProperty({ description: 'ID del subtipo de oferta', example: 2 })
	@IsNotEmpty()
	@IsNumber()
	id_sub_tipo_oferta: number;

	@ApiProperty({ description: 'ID del establecimiento', example: 3 })
	@IsNotEmpty()
	@IsNumber()
	id_establecimiento: number;

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
	id_politica_cancelacion: number;

	@ApiProperty({ description: 'Plazo en días para cancelación', example: 3 })
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	plazo_dias_cancelacion: number;

	@ApiProperty({
		description: 'Indica si se solicita garantía',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	solicita_garantia: boolean;

	@ApiProperty({ description: 'Monto de la garantía', example: 100.5 })
	@ApiPropertyOptional()
	@ValidateIf((o) => o.solicita_garantia === true)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	monto_garantia?: number;

	@ApiProperty({ description: 'ID del tipo de pago anticipado', example: 2 })
	@IsNotEmpty()
	@IsNumber()
	id_tipo_pago_anticipado: number;

	@ApiProperty({
		description: 'Porcentaje de pago anticipado',
		example: 25.5,
	})
	@ApiPropertyOptional()
	@ValidateIf((o) => o.monto_pago_anticipado === undefined)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(100)
	porcentaje_pago_anticipado?: number;

	@ApiProperty({ description: 'Monto de pago anticipado', example: 100.5 })
	@ApiPropertyOptional()
	@ValidateIf((o) => o.porcentaje_pago_anticipado === undefined)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	monto_pago_anticipado?: number;

	@ApiProperty({ description: 'Mínimo de días de estadía', example: 2 })
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	minimo_dias_estadia: number;
}

export class PoliticasReservaYDatosBasicosDto {
	@ApiProperty({ type: DatosBasicosDto })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => DatosBasicosDto)
	datos_basicos: DatosBasicosDto;

	@ApiProperty({ type: PoliticasReservaDto })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => PoliticasReservaDto)
	politicas_reserva: PoliticasReservaDto;
}
