import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TipoObservacion } from '../../enum/tipo-observacion.enum';
import { ImagenProcesadaDto } from '../dto/imagen-procesada.dto';
import { HabitacionDto } from './dto/habitacion.dto';

@Injectable()
export class HabitacionesRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

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

	async actualizarHabitacion(
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
						0,
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
							0,
						],
					);
					resultados.plazas.push(resultado[0][0]);
				}

				const resultado_caracteristicas = await manager.query(
					`CALL SP_ABM_CARACTERISTICAS_X_TIPO_DETALLE(?, ?, ?, ?)`,
					[id_tipo_detalle, caracteristicas.join(','), id_usuario, 0],
				);
				resultados.caracteristicas = resultado_caracteristicas[0][0];

				const resultado_comodidades_y_servicios_habitacion =
					await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							id_oferta,
							TipoObservacion.COMODIDADES_DETALLE_OFERTA, // ID de tipo de observación
							observaciones.texto_observacion_comodidades_y_servicios_habitacion ??
								'',
							id_usuario,
							0,
						],
					);
				resultados.observaciones.push(
					resultado_comodidades_y_servicios_habitacion[0][0],
				);

				return resultados;
			},
		);
	}

	async registrarHabitacion(id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
			[null, null, null, null, null, null, id_usuario, 0],
		);
		return result[0][0];
	}

	async eliminarHabitacion(id_usuario: string, id_tipo_detalle: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)',
			[id_tipo_detalle, null, null, null, null, null, id_usuario, 1],
		);
		return result[0][0];
	}

	async registrarImagenHabitacion(
		id_tipo_detalle: string,
		id_usuario: string,
		imagen: ImagenProcesadaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				imagen.nombre_original,
				imagen.nombre_unico,
				imagen.ruta,
				imagen.mime_type,
				id_tipo_detalle,
				id_usuario,
				imagen.tamaño,
				null,
				0,
			],
		);
		return result[0][0];
	}

	async eliminarImagenHabitacion(id_usuario: string, id_imagen: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[null, null, null, null, null, id_usuario, null, id_imagen, 1],
		);
		return result[0][0];
	}

	async obtenerImagenes(id_tipo_detalle: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_IMAGENES_X_TIPO_DETALLE(?)',
			[id_tipo_detalle],
		);
		return result[0];
	}

	async obtenerDatosRegistrados(id_usuario: string, id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_LISTAR_DATOS_REGISTRADOS_X_OFERTA(?, ?)',
			[id_usuario, id_oferta],
		);
		return result[0];
	}
}
