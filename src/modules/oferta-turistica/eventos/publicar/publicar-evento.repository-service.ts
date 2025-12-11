import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class PublicarEventoRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async publicarEvento(id_oferta: string, id_usuario: string) {
		await this.entityManager.query(`CALL SP_PUBLICAR_OFERTA(?, ?)`, [
			id_oferta,
			id_usuario,
		]);

		return;
	}
}
