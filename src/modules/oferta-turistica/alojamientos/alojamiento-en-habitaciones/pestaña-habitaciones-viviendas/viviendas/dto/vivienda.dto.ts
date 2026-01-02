import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipologiaViviendaDto } from './tipologia-vivienda.dto';
import { BañosViviendaDto } from './baños-vivienda.dto';
import { PlazasViviendaDto } from './plazas-vivienda.dto';
import { ObservacionesViviendaDto } from './observaciones-vivienda.dto';

export class ViviendaDto {
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

	@ApiProperty({ type: TipologiaViviendaDto })
	@ValidateNested()
	@Type(() => TipologiaViviendaDto)
	readonly tipologia: TipologiaViviendaDto;

	@ApiProperty({ type: [PlazasViviendaDto] })
	@ValidateNested({ each: true })
	@Type(() => PlazasViviendaDto)
	readonly plazas: PlazasViviendaDto[];

	@ApiProperty({ type: BañosViviendaDto })
	@ValidateNested()
	@Type(() => BañosViviendaDto)
	readonly baño: BañosViviendaDto;

	@ApiProperty({
		type: [Number],
		description: 'Características de la vivienda',
		example: [1, 2, 3],
	})
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	readonly caracteristicas: number[];

	@ApiProperty({
		type: ObservacionesViviendaDto,
		description: 'Observaciones de la vivienda',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ObservacionesViviendaDto)
	readonly observaciones: ObservacionesViviendaDto;
}
