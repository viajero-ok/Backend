import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class RegistrarRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarActividad(id_usuario: string, id_oferta: string) {
		const result = await this.entityManager.transaction(async (manager) => {
			return await manager.query(`CALL SP_REGISTRAR_OFERTA(?, ?)`, [
				id_oferta,
				id_usuario,
			]);
		});
		return result;
	}
}
