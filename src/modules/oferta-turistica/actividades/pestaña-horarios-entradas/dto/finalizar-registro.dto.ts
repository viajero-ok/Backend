import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';
import { ValidateHorariosTurnos } from '../../utils/horarios-turnos.validator';
import { EntradaDto } from './entradas.dto';
import { HorariosTurnosDto } from './horarios.dto';

export class FinalizarRegistroDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;

	@ApiProperty({
		type: [EntradaDto],
		description: 'Entradas de la oferta',
	})
	@IsNotEmpty()
	@ArrayMinSize(1)
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EntradaDto)
	readonly entradas: EntradaDto[];

	@ApiProperty({
		type: [HorariosTurnosDto],
		description: 'Horarios de check-in y check-out',
	})
	@IsNotEmpty()
	@ArrayMinSize(1)
	@IsArray()
	@ValidateNested({ each: true })
	@ValidateHorariosTurnos()
	@Type(() => HorariosTurnosDto)
	readonly horarios_turnos: HorariosTurnosDto[];
}
