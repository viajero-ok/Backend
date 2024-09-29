import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TipologiaDto {
	@ApiProperty({
		description: 'Nombre de la tipología de habitación',
		example: 'Cama individual',
	})
	@IsNotEmpty()
	@IsString()
	nombre_tipologia: string;

	@ApiProperty({
		description: 'Cantidad de habitaciones de esta tipología',
		example: 2,
	})
	@IsNotEmpty()
	@IsNumber()
	cantidad: number;
}
