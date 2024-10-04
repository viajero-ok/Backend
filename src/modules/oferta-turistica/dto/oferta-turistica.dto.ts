import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class OfertaTuristicaDto {
	@ApiProperty({
		description: 'ID del tipo de oferta',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	readonly id_tipo_oferta: number;

	@ApiPropertyOptional({
		description: 'ID del subtipo de oferta',
		example: 2,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	readonly id_sub_tipo_oferta?: number;

	@ApiPropertyOptional({ description: 'ID del establecimiento', example: 3 })
	@IsOptional()
	@IsNumber()
	@Min(1)
	readonly id_establecimiento?: number;
}
