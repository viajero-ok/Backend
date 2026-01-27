import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Min,
	ValidateNested,
} from 'class-validator';
import { ObservacionesCampingDto } from './observaciones-camping.dto';
import { PoliticasReservaYDatosBasicosDto } from './politicas-reserva-y-datos-basicos.dto';

export class DatosBasicosCampingDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;

	@ApiProperty({
		description: 'ID de la subcategoría de alojamiento (Camping)',
		example: 1,
	})
	@IsNumber()
	@Min(1)
	id_sub_categoria_alojamiento: number;

	@ApiPropertyOptional({
		type: [Number],
		description:
			'Características del camping (espacios, servicios, entretenimiento)',
		example: [1, 2, 3],
	})
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	@Min(1, { each: true })
	readonly caracteristicas?: number[];

	@ApiProperty({
		description: 'IDs de los métodos de pago aceptados',
		type: [Number],
		example: [1, 2, 3],
	})
	@IsNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	@Min(1, { each: true })
	readonly metodos_de_pago: number[];

	@ApiPropertyOptional({
		type: ObservacionesCampingDto,
		description: 'Observaciones del camping',
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => ObservacionesCampingDto)
	readonly observaciones?: ObservacionesCampingDto;

	@ApiProperty({
		type: PoliticasReservaYDatosBasicosDto,
		description: 'Políticas de reserva y datos básicos',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PoliticasReservaYDatosBasicosDto)
	readonly politicas_reserva_y_datos_basicos: PoliticasReservaYDatosBasicosDto;
}
