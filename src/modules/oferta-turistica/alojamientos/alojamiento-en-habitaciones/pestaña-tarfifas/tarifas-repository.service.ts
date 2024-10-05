import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TarifasDto } from './dto/tarifa.dto';
import { RegistrarTarifaDto } from './dto/registrar-tarifa-dto';

@Injectable()
export class TarifasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerDatosRegistroTarifa() {
		const resultados = {
			tipos_pension: null,
		};
		resultados.tipos_pension = (
			await this.entityManager.query('CALL SP_LISTAR_TIPOS_PENSION()')
		)[0];
		return resultados;
	}

	async registrarTarifa(
		id_usuario: string,
		registrarTarifaDto: RegistrarTarifaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null,
				registrarTarifaDto.id_tipo_detalle,
				null,
				null,
				null,
				null,
				id_usuario,
				0,
			],
		);
		return result[0][0];
	}

	async obtenerTarifas(id_tipo_detalle: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFA_X_TIPO_DETALLE(?)',
			[id_tipo_detalle],
		);
		return result[0];
	}

	async actualizarTarifa(id_usuario: string, tarifa: TarifasDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
			[
				tarifa.id_tarifa,
				tarifa.id_tipo_detalle,
				tarifa.id_tipo_pension,
				tarifa.monto_tarifa,
				tarifa.fecha_desde,
				tarifa.fecha_hasta,
				id_usuario,
				0,
			],
		);
		return result[0][0];
	}

	async eliminarTarifa(id_tarifa: string, id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
			[id_tarifa, id_usuario, 0, 0, 0, 0, 0, 1],
		);
		return result[0][0];
	}

	async obtenerDatosRegistradosTarifa(id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFAS_X_OFERTA(?)',
			[id_oferta],
		);
		return result[0];
	}
}
