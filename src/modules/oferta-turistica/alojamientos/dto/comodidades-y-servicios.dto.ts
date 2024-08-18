import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsBoolean,
	IsString,
	IsArray,
	ValidateNested,
	IsOptional,
	ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class EspaciosComunesDto {
	@ApiProperty({ description: 'Indica si hay sala de estar', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly sala_de_estar: boolean;

	@ApiProperty({
		description: 'Indica si hay sala de conferencias',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly sala_de_conferencias: boolean;

	@ApiProperty({
		description: 'Indica si hay sala de usos múltiples',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly sala_de_usos_multiples: boolean;

	@ApiProperty({
		description: 'Indica si hay sala de convenciones',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly sala_de_convenciones: boolean;

	@ApiProperty({
		description: 'Indica si hay sala de juegos para niños',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly sala_de_juegos_para_niños: boolean;

	@ApiProperty({
		description: 'Indica si hay quincho/galería',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly quincho_galeria: boolean;

	@ApiProperty({ description: 'Indica si hay sala de juegos', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly sala_de_juegos: boolean;
}

class ServiciosDto {
	@ApiProperty({ description: 'Indica si hay cochera', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly cochera: boolean;

	@ApiProperty({
		description: 'Indica si hay cochera cubierta',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly cochera_cubierta: boolean;

	@ApiProperty({ description: 'Indica si hay lavandería', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly lavanderia: boolean;

	@ApiProperty({
		description: 'Indica si hay cobertura médica',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly cobertura_medica: boolean;

	@ApiProperty({ description: 'Indica si hay bar', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly bar: boolean;

	@ApiProperty({ description: 'Indica si hay restaurante', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly restaurante: boolean;

	@ApiProperty({ description: 'Indica si hay spa', example: false })
	@IsNotEmpty()
	@IsBoolean()
	readonly spa: boolean;

	@ApiProperty({ description: 'Indica si hay sauna', example: false })
	@IsNotEmpty()
	@IsBoolean()
	readonly sauna: boolean;

	@ApiProperty({ description: 'Indica si hay gimnasio', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly gimnasio: boolean;
}

class EntretenimientoDto {
	@ApiProperty({ description: 'Indica si hay pileta', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly pileta: boolean;

	@ApiProperty({
		description: 'Indica si hay pileta climatizada',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly pileta_climatizada: boolean;

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

	@ApiProperty({
		description: 'Indica si hay juegos de niños',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly juegos_de_niños: boolean;

	@ApiProperty({
		description: 'Indica si hay acceso privado a río',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly acceso_privado_a_rio: boolean;
}

class OtrosDto {
	@ApiProperty({
		description: 'Otros servicios o comodidades',
		example: ['WiFi gratis', 'Desayuno incluido'],
	})
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	readonly otros: string[];
}

export class ComodidadesYServiciosDto {
	@ApiProperty({ type: EspaciosComunesDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => EspaciosComunesDto)
	readonly espacios_comunes: EspaciosComunesDto;

	@ApiProperty({ type: ServiciosDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ServiciosDto)
	readonly servicios: ServiciosDto;

	@ApiProperty({ type: EntretenimientoDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => EntretenimientoDto)
	readonly entretenimiento: EntretenimientoDto;

	@ApiProperty({ type: OtrosDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => OtrosDto)
	readonly otros: OtrosDto;
}
