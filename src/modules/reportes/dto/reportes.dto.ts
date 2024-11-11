import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsDateString } from 'class-validator';

export class ReportesDto {
	@ApiProperty({
		description: 'Fecha de inicio del reporte',
		example: '2024-03-01',
	})
	@IsNotEmpty()
	@IsDateString(
		{},
		{ message: 'La fecha de inicio debe ser una fecha válida' },
	)
	fecha_inicio: string;

	@ApiProperty({
		description: 'Fecha de fin del reporte',
		example: '2024-03-31',
	})
	@IsNotEmpty()
	@IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
	fecha_fin: string;
}
