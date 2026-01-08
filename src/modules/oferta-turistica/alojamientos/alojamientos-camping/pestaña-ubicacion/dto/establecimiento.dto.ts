import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Min,
	ValidateIf,
} from 'class-validator';

export class EstablecimientoDto {
	@ApiProperty({
		description: 'ID del establecimiento',
		example: 1,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	readonly id_establecimiento?: number;

	@ApiProperty({
		description: 'Nombre del establecimiento',
		example: 'Hotel Del Valle',
	})
	@IsNotEmpty()
	@IsString()
	readonly nombre: string;

	@ApiProperty({ description: 'Número de habilitación', example: '123456' })
	@IsNotEmpty()
	@IsString()
	readonly numero_habilitacion: string;

	@ApiProperty({
		description: 'Descripción del establecimiento',
		example: 'Hotel 5 estrellas',
	})
	@IsNotEmpty()
	@IsString()
	readonly descripcion: string;

	@ApiProperty({ description: 'Teléfono de contacto', example: '123456789' })
	@IsNotEmpty()
	@IsString()
	@Length(11, 11, {
		message: 'El teléfono debe tener 11 dígitos',
	})
	readonly telefono: string;

	@ApiProperty({
		example: 'algo@algo.com',
		description: 'Correo electrónico del usuario',
	})
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'El correo electrónico no es válido.' })
	readonly mail: string;

	@ApiProperty({
		description: 'Calle del establecimiento',
		example: 'Calle Falsa',
	})
	@IsNotEmpty()
	@IsString()
	readonly calle: string;

	@ApiProperty({ description: 'Si la calle no tiene altura', example: true })
	@IsNotEmpty()
	@IsBoolean()
	sin_numero: boolean;

	@ApiProperty({
		description: 'Número de la calle, se valida si sin_numero es false',
		example: '123',
	})
	@IsOptional()
	@ValidateIf((o) => !o.sin_numero)
	@IsNotEmpty()
	@IsString()
	readonly numero?: string;

	@ApiProperty({ description: 'ID de la localidad', example: 1 })
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	readonly id_localidad: number;

	@ApiProperty({ description: 'ID del departamento', example: 1 })
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	readonly id_departamento: number;

	@ApiProperty({ description: 'ID de la provincia', example: 1 })
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	readonly id_provincia: number;

	@ApiProperty({
		description: 'Latitud del establecimiento',
		example: '-31.123456',
	})
	@IsNotEmpty()
	@IsString()
	readonly latitud: string;

	@ApiProperty({
		description: 'Longitud del establecimiento',
		example: '-64.123456',
	})
	@IsNotEmpty()
	@IsString()
	readonly longitud: string;
}
