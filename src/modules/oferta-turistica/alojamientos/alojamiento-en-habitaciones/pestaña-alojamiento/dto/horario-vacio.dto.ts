import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class HorarioVacioDto {
	@ApiProperty({
		description: 'ID del horario',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly id_oferta: number;
}
