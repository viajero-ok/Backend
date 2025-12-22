import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EntradasDto {
	@ApiProperty({
		description: 'Nombre de la entrada',
		example: 'Entrada general',
	})
	@IsNotEmpty()
	@IsString()
	readonly nombre: string;

	@ApiProperty({
		description: 'Descripción de la entrada',
		example: 'Esta entrada incluye acceso al parque',
	})
	@IsNotEmpty()
	@IsString()
	readonly descripcion: string;
}
