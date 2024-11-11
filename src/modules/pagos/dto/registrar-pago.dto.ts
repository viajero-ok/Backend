import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarPagoDto {
	@ApiProperty({
		description: 'ID del pago',
		example: '1320153074',
	})
	@IsString()
	@IsNotEmpty()
	payment_id: string;

	@ApiProperty({
		description: 'Estado del pago',
		example: 'approved',
	})
	@IsString()
	@IsNotEmpty()
	status: string;

	@ApiProperty({
		description: 'Referencia externa del pago',
		example: '1e512d77-7dea-45ab-8612-302641f4a001',
	})
	@IsString()
	@IsNotEmpty()
	external_reference: string;

	@ApiProperty({
		description: 'ID de la preferencia de pago',
		example: '777402565-ae75fa4e-5f97-4899-891b-73c357748ff4',
	})
	@IsString()
	@IsNotEmpty()
	preference_id: string;
}
