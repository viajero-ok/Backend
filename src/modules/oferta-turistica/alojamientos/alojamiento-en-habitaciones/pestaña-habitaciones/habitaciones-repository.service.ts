import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TipoObservacion } from '../../../enum/tipo-observacion.enum';
import { ImagenProcesadaDto } from '../dto/imagen-procesada.dto';
import { HabitacionDto } from './dto/habitacion.dto';
import { RegistrarHabitacionDto } from './dto/registrar-habitacion.dto';
import { RegistrarImagenHabitacionDto } from './dto/registrar-imagen-habitacion.dto';

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
					tipo_detalle: null,
					plazas: [],
					caracteristicas: null,
					observaciones: [],
				};

				const resultado_tipo_detalle = await manager.query(
					'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[
						id_oferta,
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
				resultados.tipo_detalle = resultado_tipo_detalle[0][0];

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

	async registrarHabitacion(
		id_usuario: string,
		registrarHabitacionDto: RegistrarHabitacionDto,
	) {
		const { id_oferta } = registrarHabitacionDto;
		const resultado = await this.entityManager.query(
			'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[id_oferta, null, null, null, null, null, null, id_usuario, 0],
		);
		return resultado[0][0];
	}

	async eliminarHabitacion(id_usuario: string, id_tipo_detalle: string) {
		const resultado = await this.entityManager.query(
			'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null,
				id_tipo_detalle,
				null,
				null,
				null,
				null,
				null,
				id_usuario,
				1,
			],
		);
		return resultado[0][0];
	}

	async registrarImagenHabitacion(
		registrarImagenHabitacionDto: RegistrarImagenHabitacionDto,
		id_usuario: string,
		imagen: ImagenProcesadaDto,
	) {
		const resultado = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				imagen.nombre_original,
				imagen.nombre_unico,
				imagen.ruta,
				imagen.mime_type,
				registrarImagenHabitacionDto.id_tipo_detalle,
				id_usuario,
				imagen.tamaño,
				null,
				0,
			],
		);
		return resultado[0][0];
	}

	async eliminarImagenHabitacion(id_usuario: string, id_imagen: string) {
		const resultado = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[null, null, null, null, null, id_usuario, null, id_imagen, 1],
		);
		return resultado[0][0];
	}

	async obtenerImagenes(id_tipo_detalle: string) {
		const resultado = await this.entityManager.query(
			'CALL SP_OBT_IMAGENES_X_TIPO_DETALLE(?)',
			[id_tipo_detalle],
		);
		return resultado[0];
	}

	async obtenerDatosRegistradosHabitacion(id_oferta: string) {
		const resultados = {
			habitaciones: [],
			plazas: [],
			caracteristicas: [],
		};
		const resultado = await this.entityManager.query(
			'CALL SP_OBT_DATOS_HABITACIONES_X_OFERTA(?)',
			[id_oferta],
		);
		resultados.habitaciones = resultado[0];
		resultados.plazas = resultado[1];
		resultados.caracteristicas = resultado[2];
		return resultados;
	}
}
