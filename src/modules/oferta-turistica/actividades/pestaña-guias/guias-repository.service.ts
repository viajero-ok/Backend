import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class GuiasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerGuias(id_oferta: string) {
		const result = await this.entityManager.transaction(async (manager) => {
			return await manager.query(`CALL SP_OBT_GUIAS_X_ACTIVIDAD(?)`, [
				id_oferta,
			]);
		});

		return result[0];
	}
}
