import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class OfertaTuristicaRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerOfertasPorPrestador(id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_OFERTAS_TURISTICAS_X_USUARIO(?)',
			[id_usuario],
		);
		return result[0];
	}

	async obtenerTiposSubtipos() {
		const result = await this.entityManager.query(
			'CALL SP_LISTAR_TIPOS_SUBTIPOS_OFERTA()',
		);
		return { tipos: result[0], subtipos: result[1] };
	}
}
