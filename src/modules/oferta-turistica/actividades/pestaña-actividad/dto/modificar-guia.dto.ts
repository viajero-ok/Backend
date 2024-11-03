import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ModificarGuiaDto {
	@ApiProperty({
		description: 'ID de la guia',
		example: 1,
	})
	@IsNumber()
	@IsNotEmpty()
	id_guia: number;

	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsString()
	@IsNotEmpty()
	id_oferta: string;

	@ApiProperty({
		description: 'Número de resolución',
		example: '1234567890',
	})
	@IsString()
	@IsNotEmpty()
	nro_resolucion: string;

	@ApiProperty({
		description: 'Nombre de la oferta',
		example: 'Ruta de senderismo',
	})
	@IsString()
	@IsNotEmpty()
	nombre_y_apellido: string;
}
