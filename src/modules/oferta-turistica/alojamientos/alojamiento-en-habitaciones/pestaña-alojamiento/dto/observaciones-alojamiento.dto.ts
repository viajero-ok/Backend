import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ObservacionesAlojamientoDto {
	@ApiPropertyOptional({
		description: 'Texto de la observación de comodidades y servicios',
		example: 'El alojamiento cuenta con servicio de limpieza diario.',
	})
	@IsOptional()
	@IsString()
	readonly texto_observacion_comodidades_y_servicios_oferta: string;

	@ApiPropertyOptional({
		description: 'Texto de la observación de canchas y deportes',
		example: 'Disponemos de una cancha de tenis y una de fútbol.',
	})
	@IsString()
	@IsOptional()
	readonly texto_observacion_canchas_deportes: string;

	@ApiPropertyOptional({
		description: 'Texto de la observación de normas',
		example: 'No se permiten mascotas en las habitaciones.',
	})
	@IsString()
	@IsOptional()
	readonly texto_observacion_normas: string;

	@ApiPropertyOptional({
		description: 'Texto de la observación de política de garantía',
		example:
			'Se requiere un depósito reembolsable de $100 al momento del check-in.',
	})
	@IsString()
	@IsOptional()
	readonly texto_observacion_politica_garantia: string;
}
