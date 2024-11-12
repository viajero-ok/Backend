import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultarResumenOfertaDto {
	@ApiProperty({
		description: 'ID de la oferta',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	id_oferta: string;

	@ApiProperty({
		description: 'ID del detalle (puede ser un número o un string)',
	})
	@IsNotEmpty()
	id_detalle: string | number;

	@ApiProperty({
		description: 'Fecha de inicio',
		type: Date,
	})
	@IsDate()
	@IsNotEmpty()
	@Type(() => Date)
	fecha_desde: Date;

	@ApiProperty({
		description: 'Fecha de fin',
		type: Date,
	})
	@IsDate()
	@IsNotEmpty()
	@Type(() => Date)
	fecha_hasta: Date;

	@ApiProperty({
		description: 'Cantidad de personas',
		type: Number,
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Type(() => Number)
	cantidad_personas: number;
}
