import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PlazasDto {
	@ApiProperty({
		description: 'ID del tipo de cama',
		example: 2,
	})
	@IsNotEmpty()
	@IsNumber()
	id_tipo_cama: number;

	@ApiProperty({
		description: 'Cantidad de camas',
		example: 2,
	})
	@IsNotEmpty()
	@IsNumber()
	cantidad_camas: number;
}
