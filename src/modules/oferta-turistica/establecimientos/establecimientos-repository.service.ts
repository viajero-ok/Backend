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
		const result = await this.entityManager.query(
			'CALL SP_ABM_ESTABLECIMIENTOS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null,
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
				0,
			],
		);
		return result[0][0];
	}

	async actualizarEstablecimiento(
		id_usuario: string,
		establecimientoDto: EstablecimientoDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_ESTABLECIMIENTOS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				establecimientoDto.id_establecimiento,
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
				0,
			],
		);
		return result[0][0];
	}

	async eliminarEstablecimiento(
		id_usuario: string,
		id_establecimiento: string,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_ESTABLECIMIENTOS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id_establecimiento,
				null,
				null,
				null,
				null,
				null,
				id_usuario,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				1,
			],
		);
		return result[0][0];
	}

	async obtenerEstablecimientosPorPrestador(id_usuario: number) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_DATOS_ESTABLECIMIENTO_X_USUARIO(?)',
			[id_usuario],
		);
		return result[0];
	}
}
