import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ObservacionDto {
	@ApiProperty({
		description: 'ID de la observación',
		example: 1,
	})
	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	readonly id_observacion: number;

	@ApiProperty({
		description: 'ID del tipo de observación',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	readonly id_tipo_observacion: number;

	@ApiProperty({
		description: 'Texto de la observación',
		example: 'Esta es una observación importante sobre el alojamiento.',
	})
	@IsNotEmpty()
	@IsString()
	readonly texto_observacion: string;
}
