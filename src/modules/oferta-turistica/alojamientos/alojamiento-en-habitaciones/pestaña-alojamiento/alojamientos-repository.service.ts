import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { TipoObservacion } from '../../../enum/tipo-observacion.enum';
import { HorarioVacioDto } from './dto/horario-vacio.dto';

@Injectable()
export class AlojamientosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async actualizarAlojamiento(
		id_usuario: string,
		alojamientoDto: AlojamientoDto,
	) {
		return this.entityManager.transaction(
			async (manager: EntityManager) => {
				const datos_basicos =
					alojamientoDto.politicas_reserva_y_datos_basicos
						.datos_basicos;
				const politicas_reserva =
					alojamientoDto.politicas_reserva_y_datos_basicos
						.politicas_reserva;
				const observaciones = alojamientoDto.observaciones;

				const resultados = {
					alojamiento: null,
					caracteristicas: null,
					observaciones: [],
					horarios: [],
					metodos_pago: null,
				};

				//datos basicos
				const resultado_alojamiento = await manager.query(
					`CALL SP_ABM_ALOJAMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						1,
						1,
						datos_basicos.nombre_alojamiento,
						datos_basicos.descripcion_alojamiento,
						id_usuario,
						politicas_reserva.id_politica_cancelacion,
						politicas_reserva.plazo_dias_cancelacion,
						politicas_reserva.monto_garantia ? true : false,
						politicas_reserva.monto_garantia ?? null,
						politicas_reserva.id_tipo_pago_anticipado,
						politicas_reserva.porcentaje_pago_anticipado,
						politicas_reserva.minimo_dias_estadia,
						0,
					],
				);
				resultados.alojamiento = resultado_alojamiento[0][0];

				if (alojamientoDto.caracteristicas) {
					const resultado_caracteristicas = await manager.query(
						`CALL SP_ABM_CARACTERISTICAS_OFERTA(?, ?)`,
						[
							alojamientoDto.id_oferta,
							alojamientoDto.caracteristicas.join(','),
						],
					);
					resultados.caracteristicas =
						resultado_caracteristicas[0][0];
				}

				//observaciones
				if (
					observaciones.texto_observacion_comodidades_y_servicios_oferta
				) {
					const resultado_comodidades_y_servicios_oferta =
						await manager.query(
							`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
							[
								alojamientoDto.id_oferta,
								TipoObservacion.COMODIDADES_SERVICIOS_ESTABLECIMIENTO, // ID de tipo de observación
								observaciones.texto_observacion_comodidades_y_servicios_oferta,
								id_usuario,
								0,
							],
						);
					resultados.observaciones.push(
						resultado_comodidades_y_servicios_oferta[0][0],
					);
				}

				if (observaciones.texto_observacion_canchas_deportes) {
					const resultado_canchas_deportes = await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							alojamientoDto.id_oferta,
							TipoObservacion.TIPO_CANCHA_DEPORTIVA, // ID de tipo de observación
							observaciones.texto_observacion_canchas_deportes,
							id_usuario,
							0,
						],
					);
					resultados.observaciones.push(
						resultado_canchas_deportes[0][0],
					);
				}

				if (observaciones.texto_observacion_normas) {
					const resultado_normas = await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							alojamientoDto.id_oferta,
							TipoObservacion.NORMAS, // ID de tipo de observación hardcodeado
							observaciones.texto_observacion_normas,
							id_usuario,
							0,
						],
					);
					resultados.observaciones.push(resultado_normas[0][0]);
				}

				if (observaciones.texto_observacion_politica_garantia) {
					const resultado_politica_garantia = await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							alojamientoDto.id_oferta,
							TipoObservacion.POLITICA_GARANTIA, // ID de tipo de observación hardcodeado
							observaciones.texto_observacion_politica_garantia,
							id_usuario,
							0,
						],
					);
					resultados.observaciones.push(
						resultado_politica_garantia[0][0],
					);
				}

				//horarios checkin-checkout
				for (const horario of alojamientoDto.check_in_out) {
					const {
						check_in,
						check_out,
						dias_semana,
						aplica_todos_los_dias,
					} = horario;
					if (aplica_todos_los_dias) {
						dias_semana.aplica_lunes = true;
						dias_semana.aplica_martes = true;
						dias_semana.aplica_miercoles = true;
						dias_semana.aplica_jueves = true;
						dias_semana.aplica_viernes = true;
						dias_semana.aplica_sabado = true;
						dias_semana.aplica_domingo = true;
					}
					const resultado = await manager.query(
						`CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						[
							alojamientoDto.id_oferta,
							check_in.hora_check_in,
							check_in.minuto_check_in,
							check_out.hora_check_out,
							check_out.minuto_check_out,
							dias_semana.aplica_lunes,
							dias_semana.aplica_martes,
							dias_semana.aplica_miercoles,
							dias_semana.aplica_jueves,
							dias_semana.aplica_viernes,
							dias_semana.aplica_sabado,
							dias_semana.aplica_domingo,
							horario.id_horario,
							null,
							null,
							0,
						],
					);
					resultados.horarios.push(resultado[0][0]);
				}

				//metodos de pago
				const resultado_metodos_pago = await manager.query(
					`CALL SP_ABM_METODOS_PAGO_X_OFERTA(?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						alojamientoDto.metodos_de_pago.join(','),
						id_usuario,
					],
				);
				resultados.metodos_pago = resultado_metodos_pago[0][0];

				return resultados;
			},
		);
	}

	async eliminarAlojamiento(id_usuario: string, id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_ALOJAMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id_oferta,
				null,
				null,
				null,
				null,
				id_usuario,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				1,
			],
		);
		return result[0][0];
	}

	async obtenerDatosRegistroAlojamiento() {
		const caracteristicas = {
			caracteristicas_espacios_uso_comun: null,
			caracteristicas_servicios: null,
			caracteristicas_entretenimiento: null,
			caracteristicas_normas: null,
		};
		const resultados = {
			caracteristicas,
			politicas_cancelacion: null,
			tipos_pago_anticipado: null,
			metodos_pago: null,
		};

		resultados.caracteristicas.caracteristicas_espacios_uso_comun = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(1)',
			)
		)[0];

		resultados.caracteristicas.caracteristicas_servicios = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(2)',
			)
		)[0];

		resultados.caracteristicas.caracteristicas_entretenimiento = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(3)',
			)
		)[0];

		resultados.caracteristicas.caracteristicas_normas = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(4)',
			)
		)[0];

		resultados.politicas_cancelacion = (
			await this.entityManager.query(
				'CALL SP_LISTAR_POLITICAS_CANCELACION()',
			)
		)[0];

		resultados.tipos_pago_anticipado = (
			await this.entityManager.query(
				'CALL SP_LISTAR_TIPOS_PAGO_ANTICIPADO()',
			)
		)[0];

		resultados.metodos_pago = (
			await this.entityManager.query('CALL SP_LISTAR_METODOS_PAGO()')
		)[0];

		return resultados;
	}

	async obtenerDatosRegistradosAlojamiento(id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_INFO_ALOJAMIENTO(?)',
			[id_oferta],
		);
		return {
			datos_basicos: result[0][0],
			metodos_pago: result[1],
			caracteristicas: result[2],
			observaciones: result[3],
		};
	}

	async obtenerImagenes(id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_IMAGENES_X_OFERTA(?)',
			[id_oferta],
		);
		return result[0];
	}

	async registrarHorario(horarioVacioDto: HorarioVacioDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				horarioVacioDto.id_oferta,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				0,
			],
		);
		return result[0][0];
	}

	async eliminarHorario(id_horario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				id_horario,
				null,
				null,
				1,
			],
		);
		return result[0][0];
	}
}
