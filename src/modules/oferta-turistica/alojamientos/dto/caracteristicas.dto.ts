import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CaracteristicaDto {
	@ApiProperty({ description: 'ID de la característica' })
	@IsNotEmpty()
	@IsNumber()
	readonly id_caracteristica: number;
}
