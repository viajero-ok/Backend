import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ObservacionesAlojamientoDto {
	@ApiProperty({
		description: 'Texto de la observación de comodidades y servicios',
		example: 'El alojamiento cuenta con servicio de limpieza diario.',
	})
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Texto de la observación de comodidades y servicios',
		example: 'El alojamiento cuenta con servicio de limpieza diario.',
	})
	readonly texto_observacion_comodidades_y_servicios_oferta: string;

	@ApiProperty({
		description: 'Texto de la observación de canchas y deportes',
		example: 'Disponemos de una cancha de tenis y una de fútbol.',
	})
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Texto de la observación de canchas y deportes',
		example: 'Disponemos de una cancha de tenis y una de fútbol.',
	})
	readonly texto_observacion_canchas_deportes: string;

	@ApiProperty({
		description: 'Texto de la observación de normas',
		example: 'No se permiten mascotas en las habitaciones.',
	})
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Texto de la observación de normas',
		example: 'No se permiten mascotas en las habitaciones.',
	})
	readonly texto_observacion_normas: string;

	@ApiProperty({
		description: 'Texto de la observación de política de garantía',
		example:
			'Se requiere un depósito reembolsable de $100 al momento del check-in.',
	})
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Texto de la observación de política de garantía',
		example:
			'Se requiere un depósito reembolsable de $100 al momento del check-in.',
	})
	readonly texto_observacion_politica_garantia: string;
}
