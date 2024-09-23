import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ObservacionesHabitacionDto {
	@ApiProperty({
		description: 'Texto de la observación de comodidades y servicios',
		example: 'La habitación cuenta con aire acondicionado.',
	})
	@IsNotEmpty()
	@IsString()
	readonly texto_observacion_comodidades_y_servicios_habitacion: string;
}
