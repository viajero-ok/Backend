import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsBoolean,
	IsNumber,
	ValidateNested,
	Min,
	Max,
	IsOptional,
	ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

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
	aplica_lunes: boolean;

	@ApiProperty({ description: 'Indica si aplica los martes', example: true })
	@IsNotEmpty()
	@IsBoolean()
	aplica_martes: boolean;

	@ApiProperty({
		description: 'Indica si aplica los miércoles',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	aplica_miercoles: boolean;

	@ApiProperty({ description: 'Indica si aplica los jueves', example: true })
	@IsNotEmpty()
	@IsBoolean()
	aplica_jueves: boolean;

	@ApiProperty({ description: 'Indica si aplica los viernes', example: true })
	@IsNotEmpty()
	@IsBoolean()
	aplica_viernes: boolean;

	@ApiProperty({
		description: 'Indica si aplica los sábados',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	aplica_sabado: boolean;

	@ApiProperty({
		description: 'Indica si aplica los domingos',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	aplica_domingo: boolean;
}

export class CheckInOutDto {
	@ApiProperty({
		description: 'ID del horario',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@ApiPropertyOptional({
		description: 'ID del horario',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsOptional()
	@IsNumber()
	readonly id_horario?: number;

	@ApiProperty({ type: CheckInDto })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CheckInDto)
	readonly check_in: CheckInDto;

	@ApiProperty({ type: CheckOutDto })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CheckOutDto)
	readonly check_out: CheckOutDto;

	@ApiProperty({
		description: 'Indica si aplica todos los días',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_todos_los_dias: boolean;

	@ApiProperty({
		description: 'Dias de la semana que aplica este check in/out',
		type: DiasSemanaDto,
		required: false,
	})
	@ValidateNested()
	@IsNotEmpty()
	@Type(() => DiasSemanaDto)
	readonly dias_semana: DiasSemanaDto;
}
