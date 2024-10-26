import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsUUID,
	IsString,
	IsNumber,
	IsDate,
	IsNotEmpty,
	Min,
	ValidateIf,
	IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ActualizarTarifasDto {
	@ApiProperty({
		description: 'Fecha desde la que aplica la tarifa',
		example: '2023-01-01',
	})
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	fecha_desde: Date;

	@ApiProperty({
		description: 'Fecha hasta la que aplica la tarifa',
		example: '2023-12-31',
	})
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	fecha_hasta: Date;

	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174002',
	})
	@IsUUID()
	@IsNotEmpty()
	@IsString()
	id_oferta: string;

	@ApiProperty({
		description: 'ID del tipo de pensión',
		example: 1,
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	id_tipo_entrada: number;

	@ApiProperty({
		description: 'ID de la tarifa',
		example: 1,
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	id_tarifa: number;

	@ApiPropertyOptional({
		description: 'Monto de la tarifa',
		example: 1000.5,
	})
	@ValidateIf((o) => !o.bl_gratuito)
	@IsNumber()
	@IsNotEmpty()
	monto_tarifa: number;

	@ApiPropertyOptional({
		description: 'Indica si la tarifa es gratuita',
		example: true,
	})
	@ValidateIf((o) => !o.monto_tarifa)
	@IsBoolean()
	@IsNotEmpty()
	bl_gratuito: boolean;
}
