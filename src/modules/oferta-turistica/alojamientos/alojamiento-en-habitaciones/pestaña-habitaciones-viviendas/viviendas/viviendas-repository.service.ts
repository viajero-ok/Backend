import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TipoObservacion } from '../../../../enum/tipo-observacion.enum';
import { ViviendaDto } from './dto/vivienda.dto';
import { RegistrarViviendaDto } from './dto/registrar-vivienda.dto';

@Injectable()
export class ViviendasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerDatosRegistroVivienda() {
		const resultados = {
			tipos_camas: null,
			caracteristicas_viviendas: null,
			caracteristicas_comunes: null,
		};
		resultados.tipos_camas = (
			await this.entityManager.query('CALL SP_LISTAR_TIPOS_CAMA()')
		)[0];
		resultados.caracteristicas_viviendas = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(6)',
			)
		)[0];
		resultados.caracteristicas_comunes = (
			await this.entityManager.query(
				'CALL SP_LISTAR_CARACTERISTICAS_X_AMBITO(1)',
			)
		)[0];
		return resultados;
	}

	async actualizarVivienda(id_usuario: string, viviendaDto: ViviendaDto) {
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
				} = viviendaDto;

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
						`CALL SP_ABM_CAMAS_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							id_oferta,
							id_tipo_detalle,
							plaza.id_tipo_cama,
							plaza.cantidad_camas,
							0,
						],
					);
					resultados.plazas.push(resultado[0][0]);
				}

				const resultado_caracteristicas = await manager.query(
					`CALL SP_ABM_CARACTERISTICAS_X_TIPO_DETALLE(?, ?, ?)`,
					[id_tipo_detalle, caracteristicas.join(','), id_usuario],
				);
				resultados.caracteristicas = resultado_caracteristicas[0][0];

				const resultado_comodidades_y_servicios_vivienda =
					await manager.query(
						`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
						[
							id_oferta,
							TipoObservacion.COMODIDADES_DETALLE_OFERTA, // ID de tipo de observación
							observaciones.texto_observacion_comodidades_y_servicios_vivienda ??
								'',
							id_usuario,
							0,
						],
					);
				resultados.observaciones.push(
					resultado_comodidades_y_servicios_vivienda[0][0],
				);

				return resultados;
			},
		);
	}

	async registrarVivienda(
		id_usuario: string,
		registrarViviendaDto: RegistrarViviendaDto,
	) {
		const { id_oferta } = registrarViviendaDto;
		const resultado = await this.entityManager.query(
			'CALL SP_ABM_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[id_oferta, null, null, null, null, null, null, id_usuario, 0],
		);
		return resultado[0][0];
	}

	async eliminarVivienda(id_usuario: string, id_tipo_detalle: string) {
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

	async obtenerDatosRegistradosVivienda(id_oferta: string) {
		const resultados = {
			viviendas: [],
			plazas: [],
			caracteristicas: [],
		};
		const resultado = await this.entityManager.query(
			'CALL SP_OBT_DATOS_HABITACIONES_X_OFERTA(?)',
			[id_oferta],
		);
		resultados.viviendas = resultado[0];
		resultados.plazas = resultado[1];
		resultados.caracteristicas = resultado[2];
		return resultados;
	}
}
