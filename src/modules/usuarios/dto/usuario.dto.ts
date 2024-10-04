import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	Length,
	IsNumber,
	IsDateString,
	Min,
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
	@Min(1)
	readonly id_tipo_documento: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(11, 11)
	readonly telefono: string;

	//@ApiProperty()
	@IsString()
	readonly id_domicilio: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsDateString()
	readonly fecha_nacimiento: Date;
}
