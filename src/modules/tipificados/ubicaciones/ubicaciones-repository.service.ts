import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class UbicacionesRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerUbicaciones() {
		const result = await this.entityManager.query(
			'CALL SP_LISTAR_UBICACIONES()',
		);
		return result[0];
	}
}
