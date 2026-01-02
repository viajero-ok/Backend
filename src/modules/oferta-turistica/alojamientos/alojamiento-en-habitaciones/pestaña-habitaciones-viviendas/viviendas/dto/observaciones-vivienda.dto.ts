import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ObservacionesViviendaDto {
	@ApiProperty({
		description: 'Texto de la observación de comodidades y servicios',
		example: 'La vivienda cuenta con aire acondicionado y calefacción.',
	})
	@IsString()
	readonly texto_observacion_comodidades_y_servicios_vivienda: string;
}
