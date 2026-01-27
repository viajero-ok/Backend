import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class EntradaCampingDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: 'askdbaksd123123-ansjdnas12312',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

	@ApiProperty({
		description: 'Id de la entrada',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	readonly id_entrada: number;

	@ApiProperty({
		description: 'Nombre de la entrada',
		example: 'Pase por día',
	})
	@IsNotEmpty()
	@IsString()
	readonly nombre: string;

	@ApiProperty({
		description: 'Descripción de qué incluye la entrada',
		example: 'Incluye acceso a todas las instalaciones del camping',
	})
	@IsNotEmpty()
	@IsString()
	readonly descripcion: string;

	@ApiProperty({
		description: 'Indica si la entrada tiene cupo limitado o no',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly bl_sin_cupo: boolean;

	@ApiProperty({
		description: 'Cupo máximo de la entrada (null si sin_cupo es true)',
		example: 50,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	readonly cupo_maximo?: number;
}

export class EntradaCampingNuevaDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: 'askdbaksd123123-ansjdnas12312',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

	@ApiProperty({
		description: 'Nombre de la entrada',
		example: 'Pase por día',
	})
	@IsNotEmpty()
	@IsString()
	readonly nombre: string;

	@ApiProperty({
		description: 'Descripción de qué incluye la entrada',
		example: 'Incluye acceso a todas las instalaciones del camping',
	})
	@IsNotEmpty()
	@IsString()
	readonly descripcion: string;

	@ApiProperty({
		description: 'Indica si la entrada tiene cupo limitado o no',
		example: false,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly bl_sin_cupo: boolean;

	@ApiProperty({
		description: 'Cupo máximo de la entrada (null si sin_cupo es true)',
		example: 50,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	readonly cupo_maximo?: number;
}
