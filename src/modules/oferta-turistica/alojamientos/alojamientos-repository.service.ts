import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AlojamientoDto } from './dto/alojamiento/alojamiento.dto';
import { ImagenProcesadaDto } from './dto/imagen-procesada.dto';
import { AlojamientoVacioDto } from './dto/alojamiento/alojamiento-vacio.dto';
import { HabitacionDto } from './dto/habitacion/habitacion.dto';
import { HabitacionVaciaDto } from './dto/habitacion/habitacion-vacia.dto';
import { TarifaDto } from './dto/tarifa/tarifa.dto';
import { DetalleAlojamientoDto } from './dto/detalle-alojamiento.dto';
import { TipoObservacion } from './enum/tipo-observacion.enum';

@Injectable()
export class AlojamientosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarAlojamiento(
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
					`CALL SP_ABM_ALOJAMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						datos_basicos.id_tipo_oferta,
						datos_basicos.id_sub_tipo_oferta,
						datos_basicos.id_establecimiento,
						datos_basicos.nombre_alojamiento,
						datos_basicos.descripcion_alojamiento,
						id_usuario,
						politicas_reserva.id_politica_cancelacion,
						politicas_reserva.plazo_dias_cancelacion,
						politicas_reserva.solicita_garantia,
						politicas_reserva.monto_garantia,
						politicas_reserva.id_tipo_pago_anticipado,
						politicas_reserva.monto_pago_anticipado,
						politicas_reserva.porcentaje_pago_anticipado,
						politicas_reserva.minimo_dias_estadia,
						alojamientoDto.bl_eliminar ? 1 : 0,
					],
				);
				resultados.alojamiento = resultado_alojamiento[0][0];

				const resultado_caracteristicas = await manager.query(
					`CALL SP_ABM_CARACTERISTICAS_OFERTA(?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						alojamientoDto.caracteristicas
							.map((c) => c.id_caracteristica)
							.join(','),
						alojamientoDto.bl_eliminar ? 1 : 0,
					],
				);
				resultados.caracteristicas = resultado_caracteristicas[0][0];

				//observaciones
				const resultado_comodidades_y_servicios_oferta =
					await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							alojamientoDto.id_oferta,
							TipoObservacion.COMODIDADES_SERVICIOS_ESTABLECIMIENTO, // ID de tipo de observación
							observaciones.texto_observacion_comodidades_y_servicios_oferta,
							id_usuario,
							alojamientoDto.bl_eliminar ? 1 : 0,
						],
					);
				resultados.observaciones.push(
					resultado_comodidades_y_servicios_oferta[0][0],
				);

				const resultado_canchas_deportes = await manager.query(
					`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						TipoObservacion.TIPO_CANCHA_DEPORTIVA, // ID de tipo de observación
						observaciones.texto_observacion_canchas_deportes,
						id_usuario,
						alojamientoDto.bl_eliminar ? 1 : 0,
					],
				);
				resultados.observaciones.push(resultado_canchas_deportes[0][0]);

				const resultado_normas = await manager.query(
					`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						TipoObservacion.NORMAS, // ID de tipo de observación hardcodeado
						observaciones.texto_observacion_normas,
						id_usuario,
						alojamientoDto.bl_eliminar ? 1 : 0,
					],
				);
				resultados.observaciones.push(resultado_normas[0][0]);

				const resultado_politica_garantia = await manager.query(
					`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						TipoObservacion.POLITICA_GARANTIA, // ID de tipo de observación hardcodeado
						observaciones.texto_observacion_politica_garantia,
						id_usuario,
						alojamientoDto.bl_eliminar ? 1 : 0,
					],
				);
				resultados.observaciones.push(
					resultado_politica_garantia[0][0],
				);

				//horarios checkin-checkout
				if (!alojamientoDto.bl_eliminar) {
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
							`CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
								horario.id_horario ?? null,
								0,
							],
						);
						resultados.horarios.push(resultado[0][0]);
					}
				}

				//metodos de pago
				const resultado_metodos_pago = await manager.query(
					`CALL SP_ABM_METODOS_PAGO_X_OFERTA(?, ?, ?, ?)`,
					[
						alojamientoDto.id_oferta,
						alojamientoDto.metodos_de_pago.join(','),
						id_usuario,
						alojamientoDto.bl_eliminar ? 1 : 0,
					],
				);
				resultados.metodos_pago = resultado_metodos_pago[0][0];

				return resultados;
			},
		);
	}

	async registrarAlojamientoVacio(
		id_usuario: string,
		alojamientoVacioDto: AlojamientoVacioDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_ALOJAMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null,
				alojamientoVacioDto.id_tipo_oferta,
				alojamientoVacioDto.id_sub_tipo_oferta,
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
				0,
			],
		);
		return result[0][0];
	}

	async registrarImagenAlojamiento(
		id_oferta: string,
		id_usuario: string,
		imagen: ImagenProcesadaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_ALOJAMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				imagen.nombre_original,
				imagen.nombre_unico,
				imagen.ruta,
				imagen.mime_type,
				id_oferta,
				id_usuario,
				imagen.tamaño,
				null,
				0,
			],
		);
		return result[0][0];
	}

	async eliminarImagenAlojamiento(id_usuario: string, id_imagen: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_ALOJAMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[null, null, null, null, null, id_usuario, null, id_imagen, 1],
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

	async obtenerDatosRegistroHabitacion() {
		const resultados = {
			tipos_camas: null,
			caracteristicas_habitaciones: null,
		};
		resultados.tipos_camas = (
			await this.entityManager.query('CALL SP_LISTAR_TIPOS_CAMA()')
		)[0];
		resultados.caracteristicas_habitaciones = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(6)',
			)
		)[0];
		return resultados;
	}

	async registrarHabitacion(
		id_usuario: string,
		habitacionDto: HabitacionDto,
	) {
		return this.entityManager.transaction(
			async (manager: EntityManager) => {
				const {
					id_oferta,
					id_tipo_detalle,
					tipologia,
					baño,
					plazas,
					caracteristicas,
					observaciones,
					bl_eliminar,
				} = habitacionDto;

				const resultados = {
					tipoDetalle: null,
					plazas: [],
					caracteristicas: null,
					observaciones: [],
				};

				const resultTipoDetalle = await manager.query(
					'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
					[
						id_tipo_detalle,
						tipologia.nombre_tipologia,
						tipologia.cantidad,
						baño.cantidad_baños,
						baño.bl_baño_compartido ? 1 : 0,
						baño.bl_baño_adaptado ? 1 : 0,
						id_usuario,
						bl_eliminar ? 1 : 0,
					],
				);
				resultados.tipoDetalle = resultTipoDetalle[0][0];

				for (const plaza of plazas) {
					const resultado = await manager.query(
						`CALL SP_ABM_CAMAS_X_OFERTA(?, ?, ?, ?)`,
						[
							id_tipo_detalle,
							plaza.id_tipo_cama,
							plaza.cantidad_camas,
							bl_eliminar ? 1 : 0,
						],
					);
					resultados.plazas.push(resultado[0][0]);
				}

				const resultado_caracteristicas = await manager.query(
					`CALL SP_ABM_CARACTERISTICAS_X_TIPO_DETALLE(?, ?, ?, ?)`,
					[
						id_tipo_detalle,
						caracteristicas
							.map((c) => c.id_caracteristica)
							.join(','),
						id_usuario,
						bl_eliminar ? 1 : 0,
					],
				);
				resultados.caracteristicas = resultado_caracteristicas[0][0];

				const resultado_comodidades_y_servicios_habitacion =
					await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							id_oferta,
							TipoObservacion.COMODIDADES_DETALLE_OFERTA, // ID de tipo de observación
							observaciones.texto_observacion_comodidades_y_servicios_habitacion,
							id_usuario,
							bl_eliminar ? 1 : 0,
						],
					);
				resultados.observaciones.push(
					resultado_comodidades_y_servicios_habitacion[0][0],
				);

				return resultados;
			},
		);
	}

	async registrarHabitacionVacia(
		id_usuario: string,
		habitacionVaciaDto: HabitacionVaciaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null,
				habitacionVaciaDto.nombre_tipologia,
				habitacionVaciaDto.cantidad,
				null,
				null,
				null,
				id_usuario,
				0,
			],
		);
		return result[0][0];
	}

	async obtenerDatosRegistroTarifa() {
		const resultados = {
			tipos_pension: null,
		};
		resultados.tipos_pension = (
			await this.entityManager.query('CALL SP_LISTAR_TIPOS_PENSION()')
		)[0];
		return resultados;
	}

	async obtenerTarifas(id_tipo_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFAS_X_OFERTA(?)',
			[id_tipo_oferta],
		);
		console.log(result);
		return result[0];
	}

	async registrarTarifa(id_usuario: string, tarifaDto: TarifaDto) {
		const { tarifa } = tarifaDto;
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
				tarifa.bl_eliminar ? 1 : 0,
			],
		);
		console.log(result);
		return result;
	}

	async finalizarRegistroAlojamiento(
		id_usuario: string,
		detalleAlojamientoDto: DetalleAlojamientoDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ALTA_DETALLE_ALOJAMIENTO(?, ?, ?)',
			[
				detalleAlojamientoDto.id_oferta,
				detalleAlojamientoDto.id_tipo_detalle,
				id_usuario,
			],
		);
		return result;
	}
}
