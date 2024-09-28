import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsNotEmpty,
	IsString,
	IsArray,
	ValidateNested,
	IsUUID,
	IsNumber,
	IsOptional,
	ArrayMinSize,
} from 'class-validator';
import { PoliticasReservaYDatosBasicosDto } from './politicas-reserva-y-datos-basicos.dto';
import { CheckInOutDto } from './horarios.dto';
import { ValidateCheckInOut } from '../../../utils/check-in-out.validator';
import { ObservacionesAlojamientoDto } from './observaciones-alojamiento.dto';

export class AlojamientoDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;

	@ApiPropertyOptional({
		type: [Number],
		description: 'Características del alojamiento',
		example: [1, 2, 3],
	})
	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	readonly caracteristicas?: number[];

	@ApiProperty({
		description: 'IDs de los métodos de pago aceptados',
		type: [Number],
		example: [1, 2, 3],
	})
	@IsNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
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
	@ValidateCheckInOut()
	@Type(() => CheckInOutDto)
	readonly check_in_out: CheckInOutDto[];
}
