import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EntradaDto {
	@IsString()
	readonly id_oferta: string;

	@IsString()
	readonly nombre: string;

	@IsString()
	readonly incluye: string;

	@IsNumber()
	readonly precio: number;

	@IsBoolean()
	readonly sin_precio: boolean;
}

export class ModificarEntradaDto {
	@IsString()
	readonly id_oferta: string;

	@IsNumber()
	readonly id_entrada: number;

	@IsString()
	readonly nombre: string;

	@IsString()
	readonly incluye: string;

	@IsNumber()
	readonly precio: number;

	@IsBoolean()
	readonly sin_precio: boolean;
}

export class EliminarEntradaDto {
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

	@IsNotEmpty()
	@IsString()
	readonly id_entrada: string;
}
