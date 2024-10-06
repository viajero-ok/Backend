import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';

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
		registrarTarifasDto: RegistrarTarifasDto,
	) {
		const { fecha_desde, fecha_hasta } = registrarTarifasDto;
		const resultados_tarifas = [];
		return this.entityManager.transaction(
			async (manager: EntityManager) => {
				for (const tarifa of registrarTarifasDto.tarifas) {
					const result = await manager.query(
						'CALL SP_ABM_TARIFA_X_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
						[
							null,
							tarifa.id_tipo_detalle,
							tarifa.id_tipo_pension,
							tarifa.monto_tarifa,
							fecha_desde,
							fecha_hasta,
							id_usuario,
							0,
						],
					);
					resultados_tarifas.push(result[0][0]);
				}
				return resultados_tarifas;
			},
		);
	}

	async obtenerTarifas(id_tipo_detalle: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFA_X_TIPO_DETALLE(?)',
			[id_tipo_detalle],
		);
		return result[0];
	}

	async actualizarTarifa(
		id_usuario: string,
		actualizarTarifasDto: ActualizarTarifasDto,
	) {
		const { fecha_desde, fecha_hasta } = actualizarTarifasDto;
		const resultados_tarifas = [];
		return this.entityManager.transaction(
			async (manager: EntityManager) => {
				for (const tarifa of actualizarTarifasDto.tarifas) {
					const result = await manager.query(
						'CALL SP_ABM_TARIFA_X_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
						[
							tarifa.id_tarifa,
							tarifa.id_tipo_detalle,
							tarifa.id_tipo_pension,
							tarifa.monto_tarifa,
							fecha_desde,
							fecha_hasta,
							id_usuario,
							0,
						],
					);
					resultados_tarifas.push(result[0][0]);
				}
				return resultados_tarifas;
			},
		);
	}

	async eliminarTarifa(id_tarifa: number, id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
			[id_tarifa, null, null, null, null, null, id_usuario, 1],
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
