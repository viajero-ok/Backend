import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarImagenOfertaDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;
}
