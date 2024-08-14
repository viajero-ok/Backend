import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateIf,
} from 'class-validator';

export class EstablecimientoDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly nombre: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly numero_habilitacion: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly descripcion: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly telefono: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly mail: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly calle: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	readonly sin_numero: boolean;

	@ApiProperty()
	@IsOptional()
	@ValidateIf((o) => !o.sin_numero)
	@IsNotEmpty()
	@IsInt()
	readonly numero?: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	readonly id_localidad: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	readonly id_departamento: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly latitud: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly longitud: string;
}
