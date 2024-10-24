import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class HorarioVacioDto {
	@ApiProperty({
		description: 'ID del horario',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;
}
