import { ApiProperty } from '@nestjs/swagger';
import {
	IsUUID,
	IsBoolean,
	IsString,
	IsNumber,
	IsDate,
	IsNotEmpty,
	IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TarifasDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174002',
	})
	@IsUUID()
	@IsNotEmpty()
	@IsString()
	id_tipo_oferta: string;

	@ApiProperty({
		description: 'ID del tipo de detalle',
		example: '123e4567-e89b-12d3-a456-426614174002',
	})
	@IsUUID()
	@IsNotEmpty()
	@IsString()
	id_tipo_detalle: string;

	@ApiProperty({
		description: 'ID de la tarifa',
		example: '123e4567-e89b-12d3-a456-426614174002',
	})
	@IsString()
	@IsOptional()
	id_tarifa: string;

	@ApiProperty({
		description: 'ID del tipo de pensión',
		example: 1,
	})
	@IsNumber()
	@IsNotEmpty()
	id_tipo_pension: number;

	@ApiProperty({
		description: 'Monto de la tarifa',
		example: 1000.5,
	})
	@IsNumber()
	@IsNotEmpty()
	monto_tarifa: number;

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
		description: 'Indica si se debe eliminar',
		example: false,
	})
	@IsBoolean()
	@IsNotEmpty()
	bl_eliminar: boolean;
}
