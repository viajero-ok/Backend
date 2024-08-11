import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class DataLoginDto {
	@ApiProperty({
		example: 'ok',
	})
	@IsNotEmpty()
	@IsString()
	readonly resultado: string;

	@ApiProperty({
		example: 200,
		description: 'Código de estado',
	})
	@IsNotEmpty()
	@IsInt()
	readonly statusCode: number;

	@ApiProperty({
		description: 'Id del usuario',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_usuario: string;

	@ApiProperty({
		example: 'HEADER.PAYLOAD.VERIFY SIGNATURE',
		description: 'Token de acceso',
	})
	@IsNotEmpty()
	@IsString()
	readonly token: string;

	@ApiProperty({
		example: true,
		description: 'Indica si el usuario tiene perfiles',
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly tiene_perfil: boolean;

	@ApiProperty({
		example: [
			{
				id_perfil: 1,
				nombre: 'Turista',
			},
			{
				id_perfil: 2,
				nombre: 'Prestador',
			},
		],
		description: 'Perfiles del usuario',
		required: false,
	})
	@IsArray()
	@IsOptional()
	perfiles?: PerfilDto[];
}

class PerfilDto {
	@ApiProperty({ example: 1, description: 'ID del perfil' })
	@IsInt()
	id_perfil: number;

	@ApiProperty({ example: 'Turista', description: 'Nombre del perfil' })
	@IsString()
	nombre: string;
}
