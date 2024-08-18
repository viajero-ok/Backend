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
		description: 'Indica si aplica todos los días',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly aplica_todos_los_dias: boolean;

	@ApiProperty({
		description:
			'Dias de la semana que aplica este check in/out, se valida si aplica_todos_los_dias es false',
		type: DiasSemanaDto,
		required: false,
	})
	@ValidateIf((o) => !o.aplica_todos_los_dias)
	@ValidateNested()
	@IsOptional()
	@Type(() => DiasSemanaDto)
	readonly dias_semana?: DiasSemanaDto;
}

export class PoliticasYNormasDto {
	@ApiProperty({ type: [CheckInOutDto] })
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CheckInOutDto)
	readonly check_in_out: CheckInOutDto[];

	@ApiProperty({ description: 'Indica si es pet friendly', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly pet_friendly: boolean;

	@ApiProperty({ description: 'Indica si acepta niños', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly acepta_niños: boolean;

	@ApiProperty({
		description: 'Indica si se solicita garantía al ingresar',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly se_solicita_garantia: boolean;

	@ApiProperty({ description: 'Indica si acepta visitas', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly acepta_visitas: boolean;
}
