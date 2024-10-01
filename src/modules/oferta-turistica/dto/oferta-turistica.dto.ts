import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class OfertaTuristicaDto {
	@ApiProperty({
		description: 'ID del tipo de oferta',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly id_tipo_oferta: number;

	@ApiProperty({
		description: 'ID del subtipo de oferta',
		example: 2,
	})
	@IsOptional()
	@IsNumber()
	readonly id_sub_tipo_oferta?: number;
}
