import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UsuarioDto } from './usuario.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PrestadorTuristicoDto extends UsuarioDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly cuit: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly razon_social: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	readonly sitio_web: string;
}
