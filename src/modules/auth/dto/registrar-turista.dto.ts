import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegistrarTuristaDto {
	@ApiProperty({ example: 'f2432b22-4950-11ef-97d3-0242ac120002', description: 'ID del usuario' })
	@IsNotEmpty()
	@IsString()
	@Length(10, 70)
	id_usuario: string;

	@ApiProperty({ example: 'Mariano', description: 'Nombre del usuario' })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	nombre: string;

	@ApiProperty({ example: 'Luque', description: 'Apellido del usuario' })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	apellido: string;

	@ApiProperty({ example: 44444444, description: 'Número de documento de identidad' })
	@IsNotEmpty()
	@IsString()
	@Length(7, 8, { message: 'El número de documento debe tener entre 7 y 8 dígitos' })
	@Matches(/^[0-9]+$/, { message: 'El número de documento debe contener solo dígitos' })
	nro_documento_identidad: string;

	@ApiProperty({ example: 1, description: 'ID del tipo de documento' })
	@IsNotEmpty()
	@IsInt()
	id_tipo_documento: number;

	@ApiProperty({ example: '03515285722', description: 'Número de teléfono' })
	@IsNotEmpty()
	@IsString()
	@Length(11, 11)
	telefono: string;

	@ApiProperty({ example: '2001-05-30', description: 'Fecha de nacimiento' })
	@IsNotEmpty()
	@IsDateString()
	fecha_nacimiento: string;

	@ApiProperty({ example: 1, description: 'ID de la localidad' })
	@IsNotEmpty()
	@IsInt()
	id_localidad: number;

	@ApiProperty({ example: 1, description: 'ID del departamento' })
	@IsNotEmpty()
	@IsInt()
	id_departamento: number;

	@ApiProperty({ example: 1, description: 'ID de la provincia' })
	@IsNotEmpty()
	@IsInt()
	id_provincia: number;

	@ApiProperty({ example: 1, description: 'ID del país' })
	@IsNotEmpty()
	@IsInt()
	id_pais: number;

	@ApiProperty({ example: 1, description: 'ID del idioma' })
	@IsNotEmpty()
	@IsInt()
	id_idioma: number;

	@ApiProperty({ example: 2, description: 'ID del género' })
	@IsNotEmpty()
	@IsInt()
	id_genero: number;
}
