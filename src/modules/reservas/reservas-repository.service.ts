import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RegistrarReservaAlojamientoDto } from './dto/registrar-reserva-alojamiento.dto';
import { RegistrarReservaActividadDto } from './dto/registrar-reserva-actividad.dto';

@Injectable()
export class ReservasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerOfertasReservadasPorUsuario(id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_RESERVAS_TURISTA(?)',
			[id_usuario],
		);
		return result[0];
	}

	async obtenerDatosRegistradosTarifa(id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFAS_X_OFERTA(?)',
			[id_oferta],
		);
		return result[0];
	}

	async registrarReservaAlojamientos(
		id_usuario: string,
		monto_total: number,
		subtotales: Record<string, number>,
		registrarReservaDto: RegistrarReservaAlojamientoDto,
	) {
		const { detalles } = registrarReservaDto;
		const resultados = {
			alta_reserva: null,
			alta_detalles_reserva: [],
		};
		await this.entityManager.transaction(async (manager) => {
			const resultado_alta_reserva = await manager.query(
				'CALL SP_ALTA_RESERVA(?, ?, ?, ?, ?, ?, ?)',
				[
					registrarReservaDto.id_oferta,
					registrarReservaDto.mail_contacto,
					registrarReservaDto.telefono_contacto,
					registrarReservaDto.fecha_desde,
					registrarReservaDto.fecha_hasta,
					monto_total,
					id_usuario,
				],
			);
			resultados.alta_reserva = resultado_alta_reserva[0][0];
			for (const detalle of detalles) {
				const resultado_alta_detalles_reserva = await manager.query(
					'CALL SP_ALTA_DETALLES_RESERVA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[
						resultado_alta_reserva[0][0].id_reserva,
						detalle.id_tipo_detalle,
						registrarReservaDto.id_oferta,
						registrarReservaDto.fecha_desde,
						registrarReservaDto.fecha_hasta,
						null,
						detalle.cantidad,
						subtotales[detalle.id_tipo_detalle],
						monto_total,
						id_usuario,
					],
				);
				resultados.alta_detalles_reserva.push(
					resultado_alta_detalles_reserva[0][0],
				);
			}
		});
		return resultados;
	}

	async registrarReservaActividades(
		id_usuario: string,
		monto_total: number,
		subtotales: Record<string, number>,
		registrarReservaDto: RegistrarReservaActividadDto,
	) {
		const { detalles } = registrarReservaDto;
		const resultados = {
			alta_reserva: null,
			alta_detalles_reserva: [],
		};
		await this.entityManager.transaction(async (manager) => {
			const resultado_alta_reserva = await manager.query(
				'CALL SP_ALTA_RESERVA(?, ?, ?, ?, ?, ?, ?)',
				[
					registrarReservaDto.id_oferta,
					registrarReservaDto.mail_contacto,
					registrarReservaDto.telefono_contacto,
					registrarReservaDto.fecha_desde,
					registrarReservaDto.fecha_hasta,
					monto_total,
					id_usuario,
				],
			);
			resultados.alta_reserva = resultado_alta_reserva[0][0];
			for (const detalle of detalles) {
				const resultado_alta_detalles_reserva = await manager.query(
					'CALL SP_ALTA_DETALLE_RESERVA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[
						resultado_alta_reserva[0][0].id_reserva,
						detalle.id_tipo_entrada,
						registrarReservaDto.id_oferta,
						registrarReservaDto.fecha_desde,
						registrarReservaDto.fecha_hasta,
						null,
						detalle.cantidad,
						subtotales[detalle.id_tipo_entrada],
						monto_total,
						id_usuario,
					],
				);
				resultados.alta_detalles_reserva.push(
					resultado_alta_detalles_reserva[0][0],
				);
			}
		});
		return resultados;
	}

	async cancelarReserva(id_usuario: string, id_reserva: string) {
		const result = await this.entityManager.query(
			'CALL SP_CANCELAR_RESERVA_CON_POLITICA(?, ?)',
			[id_reserva, id_usuario],
		);
		return result[0][0];
	}
}
