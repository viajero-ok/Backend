import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateNested,
} from 'class-validator';
import { PoliticasReservaDto } from './politicas-reserva.dto';
import { Type } from 'class-transformer';
export class ActividadDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

	@ApiProperty({
		description: 'ID del tipo de oferta',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly id_tipo_oferta: number;

	@ApiProperty({
		description: 'ID del sub tipo de oferta',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly id_sub_tipo_oferta: number;

	@ApiProperty({
		description: 'ID del establecimiento',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_establecimiento: string;

	@ApiProperty({
		description: 'Nombre de la actividad',
		example: 'Ruta de senderismo',
	})
	@IsNotEmpty()
	@IsString()
	readonly nombre_actividad: string;

	@ApiProperty({
		description: 'Descripción de la actividad',
		example: 'Ruta de senderismo',
	})
	@IsNotEmpty()
	@IsString()
	readonly descripcion_actividad: string;

	@ApiProperty({
		description: 'Requisitos de la actividad',
		example: 'Requisitos de la actividad',
	})
	@IsNotEmpty()
	@IsString()
	readonly requisitos_actividad: string;

	@ApiProperty({ type: PoliticasReservaDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PoliticasReservaDto)
	readonly politicas_reserva: PoliticasReservaDto;

	@ApiProperty({
		description: 'ID de la dificultad',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly id_dificultad: number;

	@ApiProperty({
		description: 'Duración de la actividad',
		example: 2.5,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly duracion_actividad: number;

	@ApiProperty({
		description: 'Distancia de la actividad',
		example: 10,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly distancia_actividad: number;

	@ApiProperty({
		description: 'Bandera con guía',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly bl_con_guia: boolean;
}
