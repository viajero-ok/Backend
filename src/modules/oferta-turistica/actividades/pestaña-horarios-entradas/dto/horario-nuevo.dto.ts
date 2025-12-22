import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateIf,
	ValidateNested,
} from 'class-validator';
import {
	DiasSemanaDto,
	HorarioEntradaDto,
	HorarioSalidaDto,
} from './horarios.dto';

export class HorariosTurnosNuevoDto {
	@ApiProperty({ description: 'Id de la oferta turística' })
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

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
