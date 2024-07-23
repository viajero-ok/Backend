import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	readonly mail: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly contraseña: string;
}
