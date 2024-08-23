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
		const localidades_con_jerarquia = await this.entityManager.query(
			'CALL SP_LISTAR_UBICACIONES()',
		);
		const result: any = {
			localidades: localidades_con_jerarquia[0],
			departamentos: localidades_con_jerarquia[1],
			provincias: localidades_con_jerarquia[2],
			paises: localidades_con_jerarquia[3],
		};
		return result;
	}
}
