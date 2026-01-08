import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Min,
	ValidateNested,
} from 'class-validator';
import { ObservacionesAlojamientoDto } from './observaciones-alojamiento.dto';
import { PoliticasReservaYDatosBasicosDto } from './politicas-reserva-y-datos-basicos.dto';
import { CheckInOutDto } from './horarios.dto';
import { CaracteristicasDeLaViviendaDto } from './caracteristicas-vivienda.dto';

export class AlojamientoParticularDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;

	@ApiProperty({
		description: 'ID de la subcategoría de alojamiento',
		example: 1,
	})
	@IsNumber()
	@Min(1)
	id_sub_categoria_alojamiento: number;

	@ApiPropertyOptional({
		type: [Number],
		description: 'Características del alojamiento',
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
		type: ObservacionesAlojamientoDto,
		description: 'Observaciones del alojamiento',
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => ObservacionesAlojamientoDto)
	readonly observaciones?: ObservacionesAlojamientoDto;

	@ApiProperty({
		type: PoliticasReservaYDatosBasicosDto,
		description: 'Políticas de reserva y datos básicos',
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PoliticasReservaYDatosBasicosDto)
	readonly politicas_reserva_y_datos_basicos: PoliticasReservaYDatosBasicosDto;

	@ApiProperty({
		type: [CheckInOutDto],
		description: 'Horarios de check-in y check-out',
	})
	@IsNotEmpty()
	@ArrayMinSize(1)
	@IsArray()
	@ValidateNested({ each: true })
	//@ValidateCheckInOut()
	@Type(() => CheckInOutDto)
	readonly check_in_out: CheckInOutDto[];

	//caracteristicas de la vivienda
	@ApiPropertyOptional({
		type: CaracteristicasDeLaViviendaDto,
		description: 'Características de la vivienda',
	})
	@ValidateNested()
	@Type(() => CaracteristicasDeLaViviendaDto)
	readonly caracteristicas_de_la_vivienda?: CaracteristicasDeLaViviendaDto;
}
