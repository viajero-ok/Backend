import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class EntradaDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: 'askdbaksd123123-ansjdnas12312',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

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

export class EntradaNuevaDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: 'askdbaksd123123-ansjdnas12312',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

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
