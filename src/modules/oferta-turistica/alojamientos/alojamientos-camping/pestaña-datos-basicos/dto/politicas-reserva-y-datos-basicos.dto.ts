import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Min,
	Max,
	ValidateNested,
	ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DatosBasicosDto {
	@ApiProperty({
		description: 'Nombre del camping',
		example: 'Camping Los Álamos',
	})
	@IsNotEmpty()
	@IsString()
	nombre_alojamiento: string;

	@ApiProperty({
		description: 'Descripción del camping',
		example:
			'Hotel con más de 20 habitaciones y todas las comodidades para tu estadía en La Cumbrecita',
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

	@ApiProperty({
		description: 'Plazo en días para cancelación',
		example: 15,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	plazo_dias_cancelacion: number;

	@ApiPropertyOptional({
		description:
			'Porcentaje de pago anticipado (solo si tipo es porcentaje)',
		example: 50,
	})
	@ValidateIf((o) => o.id_tipo_pago_anticipado === 1)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(100)
	porcentaje_pago_anticipado?: number;

	@ApiProperty({
		description: 'ID del tipo de pago anticipado',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	id_tipo_pago_anticipado: number;
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
