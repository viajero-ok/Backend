import { Injectable } from '@nestjs/common';
import { EstablecimientoDto } from './dto/establecimiento.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class AlojamientosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarEstablecimiento(establecimientoDto: EstablecimientoDto) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_ESTABLECIMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				establecimientoDto.nombre,
				establecimientoDto.numero_habilitacion,
				establecimientoDto.descripcion,
				establecimientoDto.telefono,
				establecimientoDto.mail,
				establecimientoDto.calle,
				establecimientoDto.sin_numero,
				establecimientoDto.numero,
				establecimientoDto.id_localidad,
				establecimientoDto.id_departamento,
				establecimientoDto.latitud,
				establecimientoDto.longitud,
			],
		);
		return result[0][0];
	}
}
