import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEmail,
	IsNumber,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';
import { IsNotEmpty } from 'class-validator';

class DetalleReservaDto {
	@ApiProperty({
		description: 'ID del tipo de detalle (tipología de habitación)',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_tipo_detalle: string;

	@ApiProperty({
		description: 'Cantidad de habitaciones de esa tipología',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	cantidad: number;
}

export class RegistrarReservaAlojamientoDto {
	@ApiProperty({
		description: 'ID de la oferta turística',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	id_oferta: string;

	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'usuario@example.com',
	})
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	mail_contacto: string;

	@ApiProperty({
		description: 'Teléfono del usuario',
		example: '1234567890',
	})
	@IsNotEmpty()
	@IsString()
	telefono_contacto: string;

	@ApiProperty({
		description: 'Fecha de inicio de la reserva',
		example: '2024-01-01',
	})
	@IsNotEmpty()
	@IsString()
	fecha_desde: string;

	@ApiProperty({
		description: 'Fecha de fin de la reserva',
		example: '2024-01-01',
	})
	@IsNotEmpty()
	@IsString()
	fecha_hasta: string;

	@ApiProperty({
		description: 'Detalles de la reserva',
		type: [DetalleReservaDto],
	})
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	detalles: DetalleReservaDto[];
}
