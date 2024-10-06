import {
	IsOptional,
	IsInt,
	IsString,
	IsDecimal,
	Min,
	MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConsultarOfertasDto {
	@ApiPropertyOptional({
		description: 'ID del tipo de oferta',
		example: 1,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_tipo_oferta?: number;

	@ApiPropertyOptional({
		description: 'ID del subtipo de oferta',
		example: 1,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_sub_tipo_oferta?: number;

	@ApiPropertyOptional({
		description: 'ID del establecimiento',
		example: 2,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_establecimiento?: number;

	@ApiPropertyOptional({
		description: 'Texto de la oferta',
		example: 'Oferta especial',
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	nombre_oferta?: string;

	@ApiPropertyOptional({
		description: 'ID de la provincia',
		example: 3,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_provincia?: number;

	@ApiPropertyOptional({
		description: 'ID del departamento',
		example: 4,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_departamento?: number;

	@ApiPropertyOptional({
		description: 'ID de la localidad',
		example: 5,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id_localidad?: number;

	@ApiPropertyOptional({
		description: 'Monto mínimo de garantía',
		example: 100.0,
	})
	@IsOptional()
	@IsDecimal({ decimal_digits: '2' })
	@Type(() => Number)
	@Min(0)
	min_monto_garantia?: number;

	@ApiPropertyOptional({
		description: 'Monto máximo de garantía',
		example: 500.0,
	})
	@IsOptional()
	@IsDecimal({ decimal_digits: '2' })
	@Type(() => Number)
	@Min(0)
	max_monto_garantia?: number;

	@ApiPropertyOptional({
		description: 'Mínimo de días de estancia',
		example: 1,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	min_dias_estadia?: number;
}
