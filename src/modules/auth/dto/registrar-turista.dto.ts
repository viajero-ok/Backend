import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
} from 'class-validator';

export class RegistrarTuristaDto {
	@IsOptional()
	id_usuario: string;

	@ApiProperty({ example: 'Mariano', description: 'Nombre del usuario' })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100, {
		message: 'La longitud del nombre debe ser entre 1 y 100 caracteres',
	})
	readonly nombre: string;

	@ApiProperty({ example: 'Luque', description: 'Apellido del usuario' })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100, {
		message: 'La longitud del apellido debe ser entre 1 y 100 caracteres',
	})
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

	@ApiProperty({ example: '03515285324', description: 'Número de teléfono' })
	@ApiPropertyOptional()
	@IsOptional()
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

	@ApiProperty({ example: 1, description: 'ID del país' })
	@IsNotEmpty()
	@IsInt()
	readonly id_pais: number;

	@ApiProperty({ example: 1, description: 'ID del idioma' })
	@IsNotEmpty()
	@IsInt()
	readonly id_idioma: number;

	@ApiProperty({ example: 2, description: 'ID del género' })
	@IsNotEmpty()
	@IsInt()
	readonly id_genero: number;

	@ApiProperty({ example: '2001-05-30', description: 'Fecha de nacimiento' })
	@IsNotEmpty()
	@IsDateString()
	readonly fecha_nacimiento: string;
}
