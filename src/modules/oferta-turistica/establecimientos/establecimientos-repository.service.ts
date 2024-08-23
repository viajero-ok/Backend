import { Injectable } from '@nestjs/common';
import { EstablecimientoDto } from './dto/establecimiento.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class EstablecimientosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarEstablecimiento(
		id_usuario: string,
		establecimientoDto: EstablecimientoDto,
	) {
		console.log(id_usuario);
		console.log(establecimientoDto);
		const result = await this.entityManager.query(
			'CALL SP_ABM_ESTABLECIMIENTOS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				establecimientoDto.nombre,
				establecimientoDto.descripcion,
				establecimientoDto.numero_habilitacion,
				establecimientoDto.telefono,
				establecimientoDto.mail,
				id_usuario,
				establecimientoDto.calle,
				establecimientoDto.numero,
				establecimientoDto.id_localidad,
				establecimientoDto.id_departamento,
				establecimientoDto.id_provincia,
				establecimientoDto.sin_numero,
				establecimientoDto.latitud,
				establecimientoDto.longitud,
			],
		);
		return result[0][0];
	}

	async obtenerEstablecimientosPorPrestador(id_usuario: number) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_ESTABLECIMIENTOS(?)',
			[id_usuario],
		);
		return result[0];
	}
}
