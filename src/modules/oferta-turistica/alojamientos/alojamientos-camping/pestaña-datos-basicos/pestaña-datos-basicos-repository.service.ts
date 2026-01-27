import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TipoObservacion } from 'src/modules/oferta-turistica/enum/tipo-observacion.enum';
import { DatosBasicosCampingDto } from './dto/datos-basicos-camping.dto';

@Injectable()
export class PestañaDatosBasicosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async actualizarDatosBasicos(
		id_usuario: string,
		datosBasicosCampingDto: DatosBasicosCampingDto,
	) {
		return this.entityManager.transaction(
			async (manager: EntityManager) => {
				const datos_basicos =
					datosBasicosCampingDto.politicas_reserva_y_datos_basicos
						.datos_basicos;
				const politicas_reserva =
					datosBasicosCampingDto.politicas_reserva_y_datos_basicos
						.politicas_reserva;
				const observaciones = datosBasicosCampingDto.observaciones;

				const resultados = {
					alojamiento: null,
					caracteristicas: null,
					observaciones: [],
					metodos_pago: null,
				};

				// Datos básicos del camping - Tipo oferta 1 (Alojamiento), Sub tipo 3 (Camping)
				const resultado_alojamiento = await manager.query(
					`CALL SP_ABM_ALOJAMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						datosBasicosCampingDto.id_oferta,
						1, // id_tipo_oferta (Alojamiento)
						3, // id_sub_tipo_oferta (Camping)
						datosBasicosCampingDto.id_sub_categoria_alojamiento,
						datos_basicos.nombre_alojamiento,
						datos_basicos.descripcion_alojamiento,
						id_usuario,
						politicas_reserva.id_politica_cancelacion,
						politicas_reserva.plazo_dias_cancelacion,
						false, // bl_solicita_garantia
						null, // monto_garantia
						politicas_reserva.id_tipo_pago_anticipado,
						politicas_reserva.porcentaje_pago_anticipado,
						1, // minimo_dias_estadia (valor por defecto)
						0, // Acción: 0 = insertar o actualizar
					],
				);
				resultados.alojamiento = resultado_alojamiento[0][0];

				// Características del camping
				if (datosBasicosCampingDto.caracteristicas) {
					const resultado_caracteristicas = await manager.query(
						`CALL SP_ABM_CARACTERISTICAS_OFERTA(?, ?)`,
						[
							datosBasicosCampingDto.id_oferta,
							datosBasicosCampingDto.caracteristicas.join(','),
						],
					);
					resultados.caracteristicas =
						resultado_caracteristicas[0][0];
				}

				// Observaciones
				if (
					observaciones?.texto_observacion_comodidades_y_servicios_oferta
				) {
					const resultado_comodidades_y_servicios_oferta =
						await manager.query(
							`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
							[
								datosBasicosCampingDto.id_oferta,
								TipoObservacion.COMODIDADES_SERVICIOS_ESTABLECIMIENTO,
								observaciones.texto_observacion_comodidades_y_servicios_oferta,
								id_usuario,
								0,
							],
						);
					resultados.observaciones.push(
						resultado_comodidades_y_servicios_oferta[0][0],
					);
				}

				if (observaciones?.texto_observacion_normas) {
					const resultado_normas = await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							datosBasicosCampingDto.id_oferta,
							TipoObservacion.NORMAS,
							observaciones.texto_observacion_normas,
							id_usuario,
							0,
						],
					);
					resultados.observaciones.push(resultado_normas[0][0]);
				}

				// Métodos de pago
				const resultado_metodos_pago = await manager.query(
					`CALL SP_ABM_METODOS_PAGO_X_OFERTA(?, ?, ?)`,
					[
						datosBasicosCampingDto.id_oferta,
						datosBasicosCampingDto.metodos_de_pago.join(','),
						id_usuario,
					],
				);
				resultados.metodos_pago = resultado_metodos_pago[0][0];

				return resultados;
			},
		);
	}

	async obtenerDatosRegistroCamping() {
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

		// Espacios de uso común (ámbito 1)
		resultados.caracteristicas.caracteristicas_espacios_uso_comun = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(1)',
			)
		)[0];

		// Servicios (ámbito 2)
		resultados.caracteristicas.caracteristicas_servicios = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(2)',
			)
		)[0];

		// Entretenimiento (ámbito 3)
		resultados.caracteristicas.caracteristicas_entretenimiento = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(3)',
			)
		)[0];

		// Normas (ámbito 4)
		resultados.caracteristicas.caracteristicas_normas = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(4)',
			)
		)[0];

		// Políticas de cancelación
		resultados.politicas_cancelacion = (
			await this.entityManager.query(
				'CALL SP_LISTAR_POLITICAS_CANCELACION()',
			)
		)[0];

		// Tipos de pago anticipado
		resultados.tipos_pago_anticipado = (
			await this.entityManager.query(
				'CALL SP_LISTAR_TIPOS_PAGO_ANTICIPADO()',
			)
		)[0];

		// Métodos de pago
		resultados.metodos_pago = (
			await this.entityManager.query('CALL SP_LISTAR_METODOS_PAGO()')
		)[0];

		return resultados;
	}

	async obtenerDatosRegistradosCamping(id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_INFO_ALOJAMIENTO(?)',
			[id_oferta],
		);
		return {
			datos_basicos: result[0][0],
			metodos_de_pago: result[1],
			caracteristicas: result[2],
			observaciones: result[3],
		};
	}
}
