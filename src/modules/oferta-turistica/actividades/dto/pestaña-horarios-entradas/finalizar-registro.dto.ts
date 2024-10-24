import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntradasDto } from './entradas.dto';
import { HorariosTurnosDto } from './horarios.dto';
import { ValidateHorariosTurnos } from '../../utils/horarios-turnos.validator';

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
		type: [EntradasDto],
		description: 'Entradas de la oferta',
	})
	@IsNotEmpty()
	@ArrayMinSize(1)
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EntradasDto)
	readonly entradas: EntradasDto[];

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
