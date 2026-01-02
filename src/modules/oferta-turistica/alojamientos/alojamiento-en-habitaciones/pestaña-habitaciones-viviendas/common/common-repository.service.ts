import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class CommonRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async finalizarRegistroAlojamiento(id_usuario: string, id_oferta: string) {
		const resultado = await this.entityManager.query(
			'CALL SP_REGISTRAR_OFERTA(?, ?)',
			[id_oferta, id_usuario],
		);
		return resultado[0][0];
	}
}
