import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ComodidadesYServiciosDto } from './comodidades-y-servicios.dto';
import { PoliticasYNormasDto } from './politicas-y-normas.dto';

export class RegistrarCaracteristicasAlojamientoDto {
	@ApiProperty({
		type: ComodidadesYServiciosDto,
		description: 'Comodidades y servicios del alojamiento',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ComodidadesYServiciosDto)
	comodidades_y_servicios: ComodidadesYServiciosDto;

	@ApiProperty({
		type: PoliticasYNormasDto,
		description: 'Políticas y normas del alojamiento',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PoliticasYNormasDto)
	politicas_y_normas: PoliticasYNormasDto;
}
