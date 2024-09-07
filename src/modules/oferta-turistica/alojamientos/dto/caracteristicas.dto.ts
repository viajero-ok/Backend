import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateNested,
} from 'class-validator';

export class CaracteristicaDto {
	@ApiProperty({ description: 'ID de la característica' })
	@IsNotEmpty()
	@IsNumber()
	readonly id_caracteristica: number;

	@ApiProperty({ description: 'Nombre de la característica' })
	@IsNotEmpty()
	@IsString()
	readonly nombre_caracteristica: string;

	@ApiProperty({ description: 'ID del ámbito de la característica' })
	@IsNotEmpty()
	@IsNumber()
	readonly id_ambito_caracteristica: number;
}

export class CaracteristicasAlojamientoDto {
	@ApiProperty({ description: 'ID de la categoría de características' })
	@IsNotEmpty()
	@IsNumber()
	readonly id_categoria_caracteristicas: number;

	@ApiProperty({
		description: 'Array de características',
		type: [CaracteristicaDto],
	})
	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CaracteristicaDto)
	readonly caracteristicas: CaracteristicaDto[];
}
