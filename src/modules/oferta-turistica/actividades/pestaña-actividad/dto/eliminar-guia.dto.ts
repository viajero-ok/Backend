import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EliminarGuiaDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsString()
	@IsNotEmpty()
	id_oferta: string;

	@ApiProperty({
		description: 'ID de la guía',
		example: 1,
	})
	@IsNumber()
	@IsNotEmpty()
	id_guia: number;
}
