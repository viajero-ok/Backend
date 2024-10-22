import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	IsArray,
	ValidateNested,
	IsUUID,
	ArrayMinSize,
} from 'class-validator';
import { HorariosTurnosDto } from './horarios.dto';
import { ValidateHorariosTurnos } from '../../utils/horarios-turnos.validator';
import { Type } from 'class-transformer';

export class HorariosOfertaDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;

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
