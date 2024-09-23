import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class HabitacionVaciaDto {
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
