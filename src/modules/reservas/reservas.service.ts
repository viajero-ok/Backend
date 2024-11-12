import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReservasRepositoryService } from './reservas-repository.service';
import { RegistrarReservaAlojamientoDto } from './dto/registrar-reserva-alojamiento.dto';
import { TarifasOfertaDto } from './dto/tarifas-oferta.dto';
import { RegistrarReservaActividadDto } from './dto/registrar-reserva-actividad.dto';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';

@Injectable()
export class ReservasService {
	constructor(
		private readonly reservasRepositoryService: ReservasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerOfertasReservadasPorUsuario(req) {
		const result =
			await this.reservasRepositoryService.obtenerOfertasReservadasPorUsuario(
				req.user.id_usuario,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener ofertas reservadas por usuario',
			HttpStatus.CONFLICT,
		);

		return { resultado: 'ok', statusCode: 200, ofertas_reservadas: result };
	}

	async obtenerReservasPorPrestador(req) {
		const result =
			await this.reservasRepositoryService.obtenerReservasPorPrestador(
				req.user.id_usuario,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener reservas por prestador',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async reservarAlojamiento(
		req,
		registrarReservaDto: RegistrarReservaAlojamientoDto,
	) {
		const resultado_tarifas =
			await this.reservasRepositoryService.obtenerDatosRegistradosTarifa(
				registrarReservaDto.id_oferta,
			);

		this.validarFechasInicioYFin(
			registrarReservaDto.fecha_desde,
			registrarReservaDto.fecha_hasta,
			resultado_tarifas[0].fecha_desde,
			resultado_tarifas[resultado_tarifas.length - 1].fecha_hasta,
		);

		console.log('RESULTADO TARIFAS', resultado_tarifas);

		const { precio_total, subtotales } = this.obtenerPrecioTotalYSubtotales(
			registrarReservaDto,
			resultado_tarifas,
		);

		console.log('REGISTRAR RESERVA ALOJAMIENTO', registrarReservaDto);
		console.log('PRECIO TOTAL', precio_total);
		console.log('SUBTOTALES', subtotales);

		const resultado_reserva =
			await this.reservasRepositoryService.registrarReservaAlojamientos(
				req.user.id_usuario,
				precio_total,
				subtotales,
				registrarReservaDto,
			);

		this.exceptionHandlingService.handleError(
			resultado_reserva.alta_reserva,
			'Error al registrar reserva',
			HttpStatus.CONFLICT,
		);

		for (const detalle of resultado_reserva.alta_detalles_reserva) {
			this.exceptionHandlingService.handleError(
				detalle,
				'Error al registrar detalles reserva',
				HttpStatus.CONFLICT,
			);
		}

		return {
			resultado: 'ok',
			statusCode: 201,
			id_reserva: resultado_reserva.alta_reserva.id_reserva,
		};
	}

	async reservarActividad(
		req,
		registrarReservaActividadDto: RegistrarReservaActividadDto,
	) {
		const resultado_tarifas =
			await this.reservasRepositoryService.obtenerDatosRegistradosTarifa(
				registrarReservaActividadDto.id_oferta,
			);

		this.validarFechasInicioYFin(
			registrarReservaActividadDto.fecha_desde,
			registrarReservaActividadDto.fecha_hasta,
			resultado_tarifas[0].fecha_desde,
			resultado_tarifas[resultado_tarifas.length - 1].fecha_hasta,
		);

		console.log('RESULTADO TARIFAS', resultado_tarifas);

		const { precio_total, subtotales } = this.obtenerPrecioTotalYSubtotales(
			registrarReservaActividadDto,
			resultado_tarifas,
		);

		console.log(
			'REGISTRAR RESERVA ACTIVIDAD',
			registrarReservaActividadDto,
		);
		console.log('PRECIO TOTAL', precio_total);
		console.log('SUBTOTALES', subtotales);

		const resultado_reserva =
			await this.reservasRepositoryService.registrarReservaActividades(
				req.user.id_usuario,
				precio_total,
				subtotales,
				registrarReservaActividadDto,
			);

		this.exceptionHandlingService.handleError(
			resultado_reserva.alta_reserva,
			'Error al registrar reserva',
			HttpStatus.CONFLICT,
		);

		for (const detalle of resultado_reserva.alta_detalles_reserva) {
			this.exceptionHandlingService.handleError(
				detalle,
				'Error al registrar detalles reserva',
				HttpStatus.CONFLICT,
			);
		}

		return {
			resultado: 'ok',
			statusCode: 201,
			id_reserva: resultado_reserva.alta_reserva.id_reserva,
		};
	}

	validarFechasInicioYFin(
		fecha_desde_reserva,
		fecha_hasta_reserva,
		fecha_desde_tarifas,
		fecha_hasta_tarifas,
	) {
		const fecha_actual = new Date();
		const fecha_inicio = new Date(fecha_desde_reserva);
		const fecha_fin = new Date(fecha_hasta_reserva);
		const fecha_inicio_tarifas = new Date(fecha_desde_tarifas);
		const fecha_fin_tarifas = new Date(fecha_hasta_tarifas);

		//setear horas a 0
		fecha_actual.setHours(0, 0, 0, 0);
		fecha_inicio.setHours(0, 0, 0, 0);
		fecha_fin.setHours(0, 0, 0, 0);
		fecha_inicio_tarifas.setHours(0, 0, 0, 0);
		fecha_fin_tarifas.setHours(0, 0, 0, 0);

		if (fecha_inicio < fecha_actual || fecha_fin < fecha_actual) {
			throw new HttpException(
				{
					message:
						'Las fechas de inicio y fin deben ser posteriores a la fecha actual',
					statusCode: HttpStatus.BAD_REQUEST,
				},
				HttpStatus.BAD_REQUEST,
			);
		}
		if (
			fecha_inicio < fecha_inicio_tarifas ||
			fecha_fin > fecha_fin_tarifas
		) {
			throw new HttpException(
				{
					message:
						'No hay tarifas disponibles para las fechas seleccionadas',
					statusCode: HttpStatus.BAD_REQUEST,
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	obtenerPrecioTotalYSubtotales(
		registrarReservaDto:
			| RegistrarReservaAlojamientoDto
			| RegistrarReservaActividadDto,
		tarifas: TarifasOfertaDto[],
	) {
		const tarifas_por_detalle = new Map();
		let precio_total = 0;
		const subtotales_por_detalle = new Map();

		for (const detalle of registrarReservaDto.detalles) {
			const id_detalle =
				(detalle as any).id_tipo_detalle ||
				(detalle as any).id_tipo_entrada;
			console.log('ID DETALLE RESERVA', id_detalle);
			if (!tarifas_por_detalle.has(id_detalle)) {
				const tarifas_encontradas = tarifas.filter((tarifa) => {
					const id_detalle_tarifa =
						(tarifa as any).id_tipo_detalle ||
						(tarifa as any).id_tipo_entrada;
					const fecha_desde_reserva = new Date(
						registrarReservaDto.fecha_desde,
					);
					const fecha_hasta_reserva = new Date(
						registrarReservaDto.fecha_hasta,
					);
					const fecha_desde_tarifa = new Date(tarifa.fecha_desde);
					const fecha_hasta_tarifa = new Date(tarifa.fecha_hasta);

					//setear horas a 0
					fecha_desde_reserva.setHours(0, 0, 0, 0);
					fecha_hasta_reserva.setHours(0, 0, 0, 0);
					fecha_desde_tarifa.setHours(0, 0, 0, 0);
					fecha_hasta_tarifa.setHours(0, 0, 0, 0);

					console.log('ID DETALLE TARIFA', id_detalle_tarifa);
					console.log('FECHA DESDE', fecha_desde_reserva.getTime());
					console.log('FECHA HASTA', fecha_hasta_reserva.getTime());
					console.log(
						'TARIFA FECHA DESDE',
						fecha_desde_tarifa.getTime(),
					);
					console.log(
						'TARIFA FECHA HASTA',
						fecha_hasta_tarifa.getTime(),
					);
					console.log('DETALLE', id_detalle === id_detalle_tarifa);
					console.log(
						'FECHA DESDE',
						fecha_desde_reserva.getTime() >=
							fecha_desde_tarifa.getTime(),
					);
					console.log(
						'FECHA HASTA',
						fecha_hasta_reserva.getTime() <=
							fecha_hasta_tarifa.getTime(),
					);
					return (
						id_detalle === id_detalle_tarifa &&
						fecha_desde_reserva.getTime() >=
							fecha_desde_tarifa.getTime() &&
						fecha_hasta_reserva.getTime() <=
							fecha_hasta_tarifa.getTime()
					);
				});
				console.log('TARIFAS ENCONTRADAS', tarifas_encontradas);

				if (tarifas_encontradas.length > 0) {
					tarifas_por_detalle.set(id_detalle, tarifas_encontradas);
				} else {
					throw new HttpException(
						{
							message:
								'No hay tarifas disponibles para el detalle',
							statusCode: HttpStatus.BAD_REQUEST,
						},
						HttpStatus.BAD_REQUEST,
					);
				}
			}
		}

		const fecha_inicio = new Date(registrarReservaDto.fecha_desde);
		const fecha_fin = new Date(registrarReservaDto.fecha_hasta);

		for (const detalle of registrarReservaDto.detalles) {
			const id_detalle =
				(detalle as any).id_tipo_detalle ||
				(detalle as any).id_tipo_entrada;
			subtotales_por_detalle.set(id_detalle, 0);
		}

		for (
			let fecha_actual = fecha_inicio;
			fecha_actual <= fecha_fin;
			fecha_actual.setDate(fecha_actual.getDate() + 1)
		) {
			for (const detalle of registrarReservaDto.detalles) {
				const id_detalle =
					(detalle as any).id_tipo_detalle ||
					(detalle as any).id_tipo_entrada;
				const tarifas_detalle = tarifas_por_detalle.get(id_detalle);
				console.log('TARIFAS DETALLE', tarifas_por_detalle);
				if (tarifas_detalle) {
					const tarifa_del_dia = tarifas_detalle.find(
						(tarifa) =>
							fecha_actual >= new Date(tarifa.fecha_desde) &&
							fecha_actual <= new Date(tarifa.fecha_hasta),
					);

					if (tarifa_del_dia) {
						console.log('TARIFA DEL DÍA', tarifa_del_dia);
						let subtotal_dia = parseFloat(
							tarifa_del_dia.monto_tarifa,
						);
						if (isNaN(subtotal_dia)) {
							subtotal_dia = 0;
						}
						subtotales_por_detalle.set(
							id_detalle,
							subtotales_por_detalle.get(id_detalle) +
								subtotal_dia,
						);
						precio_total += subtotal_dia * detalle.cantidad;
					}
				}
			}
		}

		return {
			precio_total,
			subtotales: Object.fromEntries(subtotales_por_detalle),
		};
	}

	async cancelarReservaOfertaTuristica(req, id_reserva: string) {
		const result = await this.reservasRepositoryService.cancelarReserva(
			req.user.id_usuario,
			id_reserva,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al cancelar reserva',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}
}
