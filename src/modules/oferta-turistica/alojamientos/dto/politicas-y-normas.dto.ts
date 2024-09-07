import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsBoolean,
	IsNumber,
	IsArray,
	ValidateNested,
	Min,
	Max,
	IsOptional,
	ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateCheckInOut } from '../../utils/check-in-out.validator';
import { CaracteristicasAlojamientoDto } from './caracteristicas.dto';

class CheckInDto {
	@ApiProperty({
		description: 'Hora de Check In',
		example: 14,
		minimum: 0,
		maximum: 23,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(23)
	readonly hora_check_in: number;

	@ApiProperty({
		description: 'Minuto de Check In',
		example: 30,
		minimum: 0,
		maximum: 59,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(59)
	readonly minuto_check_in: number;
}

class CheckOutDto {
	@ApiProperty({
		description: 'Hora de Check Out',
		example: 11,
		minimum: 0,
		maximum: 23,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(23)
	readonly hora_check_out: number;

	@ApiProperty({
		description: 'Minuto de Check Out',
		example: 0,
		minimum: 0,
		maximum: 59,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(59)
	readonly minuto_check_out: number;
}

class DiasSemanaDto {
	@ApiProperty({ description: 'Indica si aplica los lunes', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_lunes: boolean;

	@ApiProperty({ description: 'Indica si aplica los martes', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_martes: boolean;

	@ApiProperty({
		description: 'Indica si aplica los miércoles',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_miercoles: boolean;

	@ApiProperty({ description: 'Indica si aplica los jueves', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_jueves: boolean;

	@ApiProperty({ description: 'Indica si aplica los viernes', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_viernes: boolean;

	@ApiProperty({
		description: 'Indica si aplica los sábados',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_sabado: boolean;

	@ApiProperty({
		description: 'Indica si aplica los domingos',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_domingo: boolean;
}

class CheckInOutDto {
	@ApiProperty({ type: CheckInDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CheckInDto)
	readonly check_in: CheckInDto;

	@ApiProperty({ type: CheckOutDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CheckOutDto)
	readonly check_out: CheckOutDto;

	@ApiProperty({
		description: 'Dias de la semana que aplica este check in/out',
		type: DiasSemanaDto,
		required: false,
	})
	@ValidateNested()
	@IsOptional()
	@Type(() => DiasSemanaDto)
	readonly dias_semana?: DiasSemanaDto;
}

export class PoliticasYNormasDto {
	@ApiProperty({
		description: 'Indica si aplica todos los días',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_todos_los_dias: boolean;

	@ApiProperty({ type: [CheckInOutDto] })
	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CheckInOutDto)
	@ValidateCheckInOut()
	readonly check_in_out: CheckInOutDto[];

	@ApiProperty({
		description: 'Características de políticas y normas',
		type: CaracteristicasAlojamientoDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CaracteristicasAlojamientoDto)
	readonly caracteristicas_alojamiento: CaracteristicasAlojamientoDto;
}
