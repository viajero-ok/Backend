import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TarifasDto } from './dto/tarifa.dto';

@Injectable()
export class PublicacionesActividadesRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerTarifas(id_tipo_detalle: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFA_X_TIPO_DETALLE(?)',
			[id_tipo_detalle],
		);
		return result[0];
	}

	async registrarTarifa(id_usuario: string, tarifa: TarifasDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				tarifa.id_tarifa,
				tarifa.id_oferta,
				tarifa.id_tipo_entrada,
				tarifa.monto_tarifa,
				tarifa.fecha_desde,
				tarifa.fecha_hasta,
				id_usuario,
				0,
				tarifa.edad_desde,
				tarifa.edad_hasta,
			],
		);
		return result[0][0];
	}

	async eliminarTarifa(id_tarifa: string, id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id_tarifa,
				null,
				null,
				null,
				null,
				null,
				id_usuario,
				1,
				null,
				null,
			],
		);
		return result[0][0];
	}
}
