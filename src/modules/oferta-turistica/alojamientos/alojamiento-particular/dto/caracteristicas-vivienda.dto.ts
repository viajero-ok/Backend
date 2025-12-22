import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	Min,
	ValidateNested,
} from 'class-validator';
import { PlazasDto } from './plazas.dto';
import { Type } from 'class-transformer';
import { BañosDto } from './baños.dto';

export class CaracteristicasDeLaViviendaDto {
	@ApiProperty({
		description: 'Cantidad de dormitorios',
		example: 2,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	readonly cantidad_dormitorios: number;

	@ApiProperty({
		type: [PlazasDto],
		description: 'Plazas de la vivienda',
	})
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => PlazasDto)
	readonly plazas: PlazasDto[];

	@ApiProperty({ type: BañosDto })
	@ValidateNested()
	@Type(() => BañosDto)
	readonly baño: BañosDto;

	@ApiProperty({
		type: [Number],
		description: 'Características de la habitación',
		example: [1, 2, 3],
	})
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	readonly caracteristicas: number[];
}
