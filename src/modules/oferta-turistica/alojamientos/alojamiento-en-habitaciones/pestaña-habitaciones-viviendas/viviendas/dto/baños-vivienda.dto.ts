import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class BañosViviendaDto {
	@ApiProperty({
		description: 'Cantidad de baños',
		example: 2,
	})
	@IsNotEmpty()
	@IsNumber()
	cantidad_baños: number;

	@ApiProperty({
		description: 'Indica si el baño es compartido',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	bl_baño_compartido: boolean;

	@ApiProperty({
		description:
			'Indica si el baño está adaptado para personas con discapacidad',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	bl_baño_adaptado: boolean;
}
