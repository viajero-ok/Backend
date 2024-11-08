import {
	IsNotEmpty,
	IsOptional,
	IsInt,
	IsString,
	Min,
	Max,
	ValidateIf,
	IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConsultarOfertasDto {
	@ApiProperty({
		description: 'Número de página',
		example: 1,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	readonly pagina: number;

	@ApiProperty({
		description: 'Número de registros por página',
		example: 10,
	})
	@IsNotEmpty()
	@Max(100)
	@IsInt()
	@Type(() => Number)
	readonly limite: number;

	@ApiProperty({
		description: 'ID del tipo de oferta',
		example: 1,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	id_tipo_oferta: number;

	@ApiPropertyOptional({
		description: 'ID del subtipo de oferta',
		example: 1,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_sub_tipo_oferta?: number;

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

	@ApiPropertyOptional({
		description: 'Latitud',
		example: '-31.123456',
	})
	@ValidateIf((o) => o.longitud)
	@IsNotEmpty()
	@IsString()
	latitud?: string;

	@ApiPropertyOptional({
		description: 'Longitud',
		example: '-64.123456',
	})
	@ValidateIf((o) => o.latitud)
	@IsNotEmpty()
	@IsString()
	longitud?: string;

	@ApiPropertyOptional({
		description: 'Radio de búsqueda en kilómetros',
		example: 10,
	})
	@ValidateIf((o) => o.latitud && o.longitud)
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	radio: number;

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
