import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetalleAlojamientoDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;

	@ApiProperty({
		description: 'ID del tipo de detalle',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_tipo_detalle: string;
}
