import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CategoriaEventoDto {
	@ApiProperty({
		description: 'ID de la categoría',
	})
	@IsNotEmpty()
	@IsNumber()
	readonly id_categoria: number;

	@ApiProperty({
		description: 'Nombre de la categoría',
	})
	@IsNotEmpty()
	@IsString()
	readonly nombre_categoria: string;
}
