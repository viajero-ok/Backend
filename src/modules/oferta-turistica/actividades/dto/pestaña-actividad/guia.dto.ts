import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GuiaDto {
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
