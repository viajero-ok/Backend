import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class EntradasDto {
	@ApiProperty({
		description: 'Id de la entrada',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	readonly id_entrada: number;

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
