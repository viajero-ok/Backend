import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateIf,
} from 'class-validator';

export class UbicacionActividadDto {
	@ApiProperty({
		description: 'ID de la oferta',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

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
	readonly id_localidad: number;

	@ApiProperty({ description: 'ID del departamento', example: 1 })
	@IsNotEmpty()
	@IsInt()
	readonly id_departamento: number;

	@ApiProperty({ description: 'ID de la provincia', example: 1 })
	@IsNotEmpty()
	@IsInt()
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

	@ApiPropertyOptional({
		description: 'Observaciones de la ubicación',
		example: 'En la plaza principal',
	})
	@IsOptional()
	@IsString()
	readonly observaciones?: string;
}
