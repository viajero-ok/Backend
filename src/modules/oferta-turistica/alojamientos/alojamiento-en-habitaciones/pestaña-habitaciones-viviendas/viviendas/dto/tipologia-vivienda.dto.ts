import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TipologiaViviendaDto {
	@ApiProperty({
		description: 'Nombre de la tipología de vivienda',
		example: 'Casa completa',
	})
	@IsNotEmpty()
	@IsString()
	nombre_tipologia: string;

	@ApiProperty({
		description: 'Cantidad de viviendas de esta tipología',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	cantidad: number;
}
