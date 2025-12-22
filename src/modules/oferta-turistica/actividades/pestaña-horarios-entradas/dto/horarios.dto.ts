import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateIf,
	ValidateNested,
} from 'class-validator';

export class HorarioEntradaDto {
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

export class HorarioSalidaDto {
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

export class DiasSemanaDto {
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

export class HorariosTurnosDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: 'dfdgfff12312gd-asdasdas12312',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

	@ApiProperty({
		description: 'ID del horario',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	readonly id_horario: number;

	@ApiProperty({ type: HorarioEntradaDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => HorarioEntradaDto)
	readonly check_in: HorarioEntradaDto;

	@ApiProperty({ type: HorarioSalidaDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => HorarioSalidaDto)
	readonly check_out: HorarioSalidaDto;

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

	@ApiPropertyOptional({
		description: 'Cupo máximo',
		example: 100,
	})
	@ValidateIf((o) => !o.bl_sin_cupo)
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	readonly cupo_maximo: number;

	@ApiPropertyOptional({
		description: 'Indica si aplica bloqueo de cupo',
		example: false,
	})
	@IsOptional()
	@IsBoolean()
	readonly bl_sin_cupo: boolean;
}
