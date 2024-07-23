import { IsNotEmpty, IsNumber } from 'class-validator';
import { UsuarioDto } from './usuario.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TuristaDto extends UsuarioDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	readonly id_localidad_origen: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	readonly id_idioma: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	readonly id_genero: number;
}
