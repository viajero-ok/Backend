import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ObservacionesCampingDto {
	@ApiPropertyOptional({
		description:
			'Texto de la observación de espacios de uso común, servicios y entretenimiento',
		example:
			'Agregue otros espacios, servicios o entretenimiento de los cuales dispone el camping.',
	})
	@IsOptional()
	@IsString()
	readonly texto_observacion_comodidades_y_servicios_oferta?: string;

	@ApiPropertyOptional({
		description: 'Texto de la observación de normas del camping',
		example: 'Se aceptan mascotas, niños y visitas.',
	})
	@IsString()
	@IsOptional()
	readonly texto_observacion_normas?: string;
}
