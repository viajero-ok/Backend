import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class EventoRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerCategoriasEvento() {
		const result = await this.entityManager.query(
			`CALL SP_LISTAR_SUBTIPOS_EVENTOS`,
		);
		return result[0];
	}

	// async guardarDatosBasicos(
	//     id_usuario: string,
	// 	datosBasicosDto: GuardarDatosBasicosEventoDto,
	// ) {
	// 	const result = await this.entityManager.query(`CALL SP_ABM_EVENTO`, [

	//     ]);
	// 	return result[0][0];
	// }
}
