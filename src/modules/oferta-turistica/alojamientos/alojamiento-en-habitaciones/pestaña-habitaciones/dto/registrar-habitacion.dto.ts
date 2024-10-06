import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RegistrarHabitacionDto {
	@ApiProperty({
		example: '123e4567-e89b-12d3-a456-426614174000',
		description: 'ID de la oferta',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	readonly id_oferta: string;
}
