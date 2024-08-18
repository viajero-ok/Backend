import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AlojamientoDto } from './dto/alojamiento.dto';

@Injectable()
export class AlojamientosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarAlojamiento(
		id_usuario: string,
		alojamientoDto: AlojamientoDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_ALOJAMIENTOS(?)',
			[id_usuario],
			// atributos de alojamientoDto
		);
		return result[0][0];
	}
}
