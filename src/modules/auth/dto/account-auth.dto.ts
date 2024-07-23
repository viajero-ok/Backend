import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class AccountAuthDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'El correo electrónico no es válido.' })
	readonly mail: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(8, {
		message: 'La contraseña debe ser de al menos 8 caracteres.',
	})
	@Matches(/(?=.*[0-9])/, {
		message: 'La contraseña debe contener al menos un número.',
	})
	@Matches(/(?=.*[!@#$%^&*])/, {
		message: 'La contraseña debe contener al menos un carácter especial.',
	})
	readonly contraseña: string;

	@IsOptional()
	readonly codigo_verificacion: string;
}
