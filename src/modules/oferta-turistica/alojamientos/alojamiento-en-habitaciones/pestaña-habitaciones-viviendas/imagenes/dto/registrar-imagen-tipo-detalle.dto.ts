import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarImagenTipoDetalleDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_tipo_detalle: string;
}
