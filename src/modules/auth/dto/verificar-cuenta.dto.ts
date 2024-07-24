import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerificarCuentaDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly id_usuario: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	readonly codigo_verificacion: string;
}
