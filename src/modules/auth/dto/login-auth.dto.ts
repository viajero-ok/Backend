import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
	@ApiProperty({
		example: 'algo@algo.com',
		description: 'Correo electrónico del usuario',
	})
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	readonly mail: string;

	@ApiProperty({
		example: 'ContraseñaSegura123#',
		description: 'Contraseña del usuario',
	})
	@IsNotEmpty()
	@IsString()
	readonly contraseña: string;
}
