import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class EntradaVaciaDto {
	@ApiProperty({
		description: 'Id de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsUUID()
	@IsString()
	readonly id_oferta: string;
}
