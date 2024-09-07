import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsBoolean,
	IsString,
	IsArray,
	ValidateNested,
	IsOptional,
	ValidateIf,
	ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CaracteristicasAlojamientoDto } from './caracteristicas.dto';
class DeportesDto {
	@ApiProperty({
		description: 'Indica si hay cancha de deportes',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly cancha_de_deportes: boolean;

	@ApiProperty({
		description:
			'Deportes disponibles, se valida si cancha_de_deportes es true',
		example: 'Fútbol, Tenis',
		required: false,
	})
	@IsOptional()
	@ValidateIf((o) => o.cancha_de_deportes)
	@IsNotEmpty()
	@IsString()
	readonly deportes?: string;
}

class OtrosDto {
	@ApiProperty({
		description: 'Otros servicios o comodidades',
		example: ['WiFi gratis', 'Desayuno incluido'],
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	readonly otros: string[];
}

export class ComodidadesYServiciosDto {
	@ApiProperty({
		description: 'Características de comodidades y servicios',
		type: [CaracteristicasAlojamientoDto],
	})
	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CaracteristicasAlojamientoDto)
	readonly caracteristicas_alojamiento: CaracteristicasAlojamientoDto[];

	@ApiProperty({ type: DeportesDto })
	@IsOptional()
	@ValidateNested()
	@Type(() => DeportesDto)
	readonly deportes?: DeportesDto;

	@ApiProperty({ type: OtrosDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => OtrosDto)
	readonly otros: OtrosDto;
}
