import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsNotEmpty,
	IsString,
	IsDate,
	Length,
	IsNumber,
} from 'class-validator';

export class UsuarioDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly id_usuario: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly nombre: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly apellido: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	readonly nro_documento_identidad: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	readonly id_tipo_documento: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(11, 11)
	readonly telefono: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	readonly fecha_nacimiento: Date;
}
