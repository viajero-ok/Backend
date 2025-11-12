import { IsNumber, IsString } from 'class-validator';

export class NuevaRedSocialDto {
	@IsNumber()
	readonly id_tipo_entidad: number;

	@IsString()
	readonly id_entidad: string;

	@IsNumber()
	readonly id_red_social: number;

	@IsString()
	readonly nombre_usuario: string;

	@IsString()
	readonly url: string;
}

export class EliminarRedSocialDto {
	@IsNumber()
	readonly id_tipo_entidad: number;

	@IsString()
	readonly id_entidad: string;

	@IsNumber()
	readonly id_red_social: number;
}
