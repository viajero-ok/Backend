import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipologiaDto } from './tipologia.dto';
import { BañosDto } from './baños.dto';
import { PlazasDto } from './plazas.dto';
import { ObservacionesHabitacionDto } from './observaciones-habitacion.dto';

export class HabitacionDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	readonly id_oferta: string;

	@ApiProperty({
		description: 'ID del tipo de detalle',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	readonly id_tipo_detalle: string;

	@ApiProperty({ type: TipologiaDto })
	@ValidateNested()
	@Type(() => TipologiaDto)
	readonly tipologia: TipologiaDto;

	@ApiProperty({ type: [PlazasDto] })
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

	@ApiProperty({
		type: ObservacionesHabitacionDto,
		description: 'Observaciones de la habitación',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ObservacionesHabitacionDto)
	readonly observaciones: ObservacionesHabitacionDto;

	@ApiProperty({
		description: 'Bandera para eliminar la habitación',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly bl_eliminar: boolean;
}
