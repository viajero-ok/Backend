import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
} from 'class-validator';

export class RegistrarPrestadorDto {
	@IsOptional()
	id_usuario: string;

	@ApiProperty({ example: 'Mariano', description: 'Nombre del usuario' })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	readonly nombre: string;

	@ApiProperty({ example: 'Luque', description: 'Apellido del usuario' })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	readonly apellido: string;

	@ApiProperty({
		example: 44444444,
		description: 'Número de documento de identidad',
	})
	@IsNotEmpty()
	@IsString()
	@Length(7, 8, {
		message: 'El número de documento debe tener entre 7 y 8 dígitos',
	})
	@Matches(/^[0-9]+$/, {
		message: 'El número de documento debe contener solo dígitos',
	})
	readonly nro_documento_identidad: string;

	@ApiProperty({ example: 1, description: 'ID del tipo de documento' })
	@IsNotEmpty()
	@IsInt()
	readonly id_tipo_documento: number;

	@ApiProperty({ example: '03515285722', description: 'Número de teléfono' })
	@IsNotEmpty()
	@IsString()
	@Length(11, 11, {
		message: 'El teléfono debe tener 11 dígitos',
	})
	readonly telefono: string;

	@ApiProperty({ example: 1, description: 'ID de la localidad' })
	@IsNotEmpty()
	@IsInt()
	readonly id_localidad: number;

	@ApiProperty({ example: 1, description: 'ID del departamento' })
	@IsNotEmpty()
	@IsInt()
	readonly id_departamento: number;

	@ApiProperty({ example: 1, description: 'ID de la provincia' })
	@IsNotEmpty()
	@IsInt()
	readonly id_provincia: number;

	@ApiProperty({
		example: '20-12345678-9',
		description: 'CUIT del prestador',
	})
	@IsNotEmpty()
	@IsString()
	@Length(13, 13, {
		message: 'El CUIT debe tener 13 caracteres, incluyendo los guiones',
	})
	@Matches(/^[0-9]{2}-[0-9]{8}-[0-9]$/, {
		message:
			'El CUIT debe seguir el formato XX-XXXXXXXX-X y contener solo dígitos y guiones en las posiciones correctas',
	})
	readonly cuit: string;

	@ApiProperty({
		example: 'Fulano Alojamientos',
		description: 'Razón social del prestador',
	})
	@IsNotEmpty()
	@IsString()
	readonly razon_social: string;

	/* @ApiProperty({
		example: 'www.fulanoalojamientos.com',
		description: 'Sitio web del prestador',
	})
	@IsOptional()
	@IsString()
	readonly sitio_web: string; */

	@ApiProperty({ example: '2001-05-30', description: 'Fecha de nacimiento' })
	@IsNotEmpty()
	@IsDateString(
		{},
		{ message: 'La fecha de nacimiento debe ser una fecha válida' },
	)
	readonly fecha_nacimiento: string;
}
