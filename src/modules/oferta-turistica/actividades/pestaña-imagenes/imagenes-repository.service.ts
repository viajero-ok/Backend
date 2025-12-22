import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ImagenesRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerImagenes(id_oferta: string) {
		const result = await this.entityManager.query(
			`CALL SP_OBT_IMAGENES_X_OFERTA(?)`,
			[id_oferta],
		);
		return result[0];
	}
}
