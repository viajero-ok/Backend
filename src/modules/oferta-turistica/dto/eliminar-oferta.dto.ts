import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarOfertaDto {
	@ApiProperty({
		description: 'ID de la oferta turística',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	id_oferta: string;

	@ApiProperty({
		description: 'ID del tipo de oferta turística',
		example: '1',
	})
	@IsNotEmpty()
	@IsNumber()
	id_tipo_oferta: number;
}
