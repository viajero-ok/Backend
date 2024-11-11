import {
	IsNotEmpty,
	IsOptional,
	IsInt,
	IsString,
	Min,
	IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConsultarOfertaDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '1234567890',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

	@ApiPropertyOptional({
		description: 'ID de la localidad',
		example: 5,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_localidad?: number;

	@ApiPropertyOptional({
		description: 'Monto mínimo de la oferta',
		example: 100.0,
	})
	@IsOptional()
	@Type(() => Number)
	@Min(0)
	min_monto?: number;

	@ApiPropertyOptional({
		description: 'Monto máximo de la oferta',
		example: 500.0,
	})
	@IsOptional()
	@Type(() => Number)
	@Min(0)
	max_monto?: number;

	@ApiProperty({
		description: 'Fecha de desde de la oferta',
		example: '2024-01-01',
	})
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	fecha_desde: Date;

	@ApiProperty({
		description: 'Fecha de hasta de la oferta',
		example: '2024-01-01',
	})
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	fecha_hasta: Date;

	@ApiProperty({
		description: 'Cantidad de personas',
		example: 1,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	cantidad_personas: number;
}
