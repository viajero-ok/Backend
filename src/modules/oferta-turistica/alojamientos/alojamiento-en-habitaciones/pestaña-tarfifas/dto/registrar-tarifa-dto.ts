import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrarTarifaDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	id_tipo_detalle: string;
}
