import { ApiProperty } from '@nestjs/swagger';
import {
	IsUUID,
	IsString,
	IsNumber,
	IsDate,
	IsNotEmpty,
	Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarTarifasDto {
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
		description: 'Monto de la tarifa',
		example: 1000.5,
	})
	@IsNumber()
	@IsNotEmpty()
	monto_tarifa: number;
}
