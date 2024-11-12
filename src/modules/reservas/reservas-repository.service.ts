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
		console.log(result);
		return result[0];
	}

	async obtenerReservasPorPrestador(id_usuario: string) {
		const resultados = {
			estados_reserva: [],
			reservas: [],
			detalles_reserva: [],
			turistas: [],
			ofertas: [],
		};
		const result = await this.entityManager.query(
			'CALL SP_OBT_RESERVAS_PRESTADOR(?)',
			[id_usuario],
		);
		resultados.estados_reserva = result[0];
		resultados.reservas = result[1];
		resultados.detalles_reserva = result[2];
		resultados.turistas = result[3];
		resultados.ofertas = result[4];
		return resultados;
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
			console.log('Parámetros SP_ALTA_RESERVA:');
			console.log('1. ID Oferta:', registrarReservaDto.id_oferta);
			console.log(
				'2. Mail de contacto:',
				registrarReservaDto.mail_contacto,
			);
			console.log(
				'3. Teléfono de contacto:',
				registrarReservaDto.telefono_contacto,
			);
			console.log('4. Fecha desde:', registrarReservaDto.fecha_desde);
			console.log('5. Fecha hasta:', registrarReservaDto.fecha_hasta);
			console.log('6. Monto total:', monto_total);
			console.log('7. ID Usuario:', id_usuario);
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
				console.log('\nParámetros SP_ALTA_DETALLE_RESERVA:');
				console.log(
					'1. ID Reserva:',
					resultado_alta_reserva[0][0].id_reserva,
				);
				console.log('2. ID Tipo Detalle:', detalle.id_tipo_detalle);
				console.log('3. ID Tipo Entrada:', null);
				console.log('4. ID Oferta:', registrarReservaDto.id_oferta);
				console.log('5. Fecha desde:', registrarReservaDto.fecha_desde);
				console.log('6. Fecha hasta:', registrarReservaDto.fecha_hasta);
				console.log('7. ID Horario:', null);
				console.log('8. Cantidad:', detalle.cantidad);
				console.log(
					'9. Subtotal:',
					subtotales[detalle.id_tipo_detalle],
				);
				console.log('10. Monto total:', monto_total);
				console.log('11. ID Usuario:', id_usuario);
				const resultado_alta_detalles_reserva = await manager.query(
					'CALL SP_ALTA_DETALLE_RESERVA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[
						resultado_alta_reserva[0][0].id_reserva,
						detalle.id_tipo_detalle,
						null,
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
			console.log('Parámetros SP_ALTA_RESERVA:');
			console.log('1. ID Oferta:', registrarReservaDto.id_oferta);
			console.log(
				'2. Mail de contacto:',
				registrarReservaDto.mail_contacto,
			);
			console.log(
				'3. Teléfono de contacto:',
				registrarReservaDto.telefono_contacto,
			);
			console.log('4. Fecha desde:', registrarReservaDto.fecha_desde);
			console.log('5. Fecha hasta:', registrarReservaDto.fecha_hasta);
			console.log('6. Monto total:', monto_total);
			console.log('7. ID Usuario:', id_usuario);
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
				console.log('\nParámetros SP_ALTA_DETALLE_RESERVA:');
				console.log(
					'1. ID Reserva:',
					resultado_alta_reserva[0][0].id_reserva,
				);
				console.log('2. ID Tipo Detalle:', null);
				console.log('3. ID Tipo Entrada:', detalle.id_tipo_entrada);
				console.log('4. ID Oferta:', registrarReservaDto.id_oferta);
				console.log('5. Fecha desde:', registrarReservaDto.fecha_desde);
				console.log('6. Fecha hasta:', registrarReservaDto.fecha_hasta);
				console.log('7. ID Horario:', detalle.id_horario);
				console.log('8. Cantidad:', detalle.cantidad);
				console.log(
					'9. Subtotal:',
					subtotales[detalle.id_tipo_entrada],
				);
				console.log('10. Monto total:', monto_total);
				console.log('11. ID Usuario:', id_usuario);

				const resultado_alta_detalles_reserva = await manager.query(
					'CALL SP_ALTA_DETALLE_RESERVA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[
						resultado_alta_reserva[0][0].id_reserva,
						null,
						detalle.id_tipo_entrada,
						registrarReservaDto.id_oferta,
						registrarReservaDto.fecha_desde,
						registrarReservaDto.fecha_hasta,
						detalle.id_horario,
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
