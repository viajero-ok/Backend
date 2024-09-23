import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class ImagenProcesadaDto {
	@ApiProperty({ description: 'Nombre original del archivo' })
	@IsString()
	nombre_original: string;

	@ApiProperty({ description: 'Nombre único del archivo' })
	@IsString()
	nombre_unico: string;

	@ApiProperty({ description: 'Ruta del archivo' })
	@IsString()
	ruta: string;

	@ApiProperty({ description: 'Tipo MIME del archivo' })
	@IsString()
	mime_type: string;

	@ApiProperty({ description: 'Tamaño del archivo en bytes' })
	@IsNumber()
	tamaño: number;
}
