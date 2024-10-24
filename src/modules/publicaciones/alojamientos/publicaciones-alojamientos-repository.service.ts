import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';

@Injectable()
export class PublicacionesAlojamientosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerDatosPublicacionAlojamiento(id_oferta: string) {
		const resultado = await this.entityManager.query(
			'CALL SP_OBT_TIPOS_DETALLE_X_OFERTA(?)',
			[id_oferta],
		);
		return resultado[0];
	}

	async registrarTarifa(
		id_usuario: string,
		registrarTarifasDto: RegistrarTarifasDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null,
				registrarTarifasDto.id_oferta,
				registrarTarifasDto.id_tipo_detalle,
				null,
				registrarTarifasDto.monto_tarifa,
				registrarTarifasDto.fecha_desde,
				registrarTarifasDto.fecha_hasta,
				id_usuario,
				0,
			],
		);
		return result[0][0];
	}

	async obtenerTarifas(id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFAS_X_OFERTA(?)',
			[id_oferta],
		);
		return result[0];
	}

	async actualizarTarifa(
		id_usuario: string,
		actualizarTarifasDto: ActualizarTarifasDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				actualizarTarifasDto.id_tarifa,
				actualizarTarifasDto.id_oferta,
				actualizarTarifasDto.id_tipo_detalle,
				null,
				actualizarTarifasDto.monto_tarifa,
				actualizarTarifasDto.fecha_desde,
				actualizarTarifasDto.fecha_hasta,
				id_usuario,
				0,
			],
		);
		return result;
	}

	async eliminarTarifa(id_tarifa: number, id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[id_tarifa, null, null, null, null, null, null, id_usuario, 1],
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
