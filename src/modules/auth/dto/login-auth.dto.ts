import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@ApiTags('auth')
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
