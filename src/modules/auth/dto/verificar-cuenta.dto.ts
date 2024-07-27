import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerificarCuentaDto {
	@ApiProperty({
		example: 'f2432b22-4950-11ef-97d3-0242ac120002',
		description: 'ID del usuario',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_usuario: string;

	@ApiProperty({ example: '12345678', description: 'Código de verificación' })
	@IsNotEmpty()
	@IsString()
	@Length(8, 8)
	readonly codigo_verificacion: string;
}
