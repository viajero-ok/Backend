import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ComodidadesYServiciosDto } from './comodidades-y-servicios.dto';
import { PoliticasYNormasDto } from './politicas-y-normas.dto';
import { HabitacionesDto } from './habitaciones.dto';

export class AlojamientoDto {
	@ApiProperty({
		type: ComodidadesYServiciosDto,
		description: 'Comodidades y servicios del alojamiento',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ComodidadesYServiciosDto)
	readonly comodidades_y_servicios: ComodidadesYServiciosDto;

	@ApiProperty({
		type: PoliticasYNormasDto,
		description: 'Políticas y normas del alojamiento',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PoliticasYNormasDto)
	readonly politicas_y_normas: PoliticasYNormasDto;

	@ApiProperty({
		type: HabitacionesDto,
		description: 'Información sobre las habitaciones del alojamiento',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => HabitacionesDto)
	readonly habitaciones: HabitacionesDto;
}
