import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ActividadDto } from './dto/actividad.dto';
import { EliminarGuiaDto } from './dto/eliminar-guia.dto';
import { RegistrarGuiaDto } from './dto/registrar-guia.dto';
import { ModificarGuiaDto } from './dto/modificar-guia.dto';

@Injectable()
export class ActividadRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerDatosRegistroActividades() {
		const resultados = {
			tipos_y_subtipos: {
				tipos: [],
				subtipos: [],
			},
			sub_categorias_actividades: [],
			dificultad_actividades: [],
			politicas_cancelacion: null,
			tipos_pago_anticipado: null,
			metodos_pago: null,
		};
		await this.entityManager.transaction(async (manager: EntityManager) => {
			const tipos_subtipos = await manager.query(
				`CALL SP_LISTAR_TIPOS_SUBTIPOS_OFERTA()`,
			);
			resultados.tipos_y_subtipos.tipos = tipos_subtipos[0];
			const tipos_subtipos_actividades = tipos_subtipos[1].filter(
				(subtipo) => subtipo.id_tipo_oferta === 2,
			);
			resultados.tipos_y_subtipos.subtipos = tipos_subtipos_actividades;

			const sub_categorias_actividades = await manager.query(
				`CALL SP_LISTAR_SUBCATEGORIAS_ACTIVIDADES()`,
			);
			resultados.sub_categorias_actividades =
				sub_categorias_actividades[0];

			const dificultad_actividades = await manager.query(
				`CALL SP_LISTAR_DIFICULTAD_ACTIVIDAD()`,
			);
			resultados.dificultad_actividades = dificultad_actividades[0];

			const politicas_cancelacion = await manager.query(
				`CALL SP_LISTAR_POLITICAS_CANCELACION()`,
			);
			resultados.politicas_cancelacion = politicas_cancelacion[0];

			const tipos_pago_anticipado = await manager.query(
				`CALL SP_LISTAR_TIPOS_PAGO_ANTICIPADO()`,
			);
			resultados.tipos_pago_anticipado = tipos_pago_anticipado[0];

			const metodos_pago = await manager.query(
				`CALL SP_LISTAR_METODOS_PAGO()`,
			);
			resultados.metodos_pago = metodos_pago[0];
		});
		return resultados;
	}

	async registrarGuia(id_usuario: string, guiaDto: RegistrarGuiaDto) {
		const result = await this.entityManager.query(
			`CALL SP_ABM_GUIAS_X_ACTIVIDAD(?, ?, ?, ?, ?, ?)`,
			[
				guiaDto.id_oferta,
				guiaDto.nro_resolucion,
				guiaDto.nombre_y_apellido,
				id_usuario,
				null,
				0,
			],
		);
		return result[0][0];
	}

	async modificarGuia(id_usuario: string, guiaDto: ModificarGuiaDto) {
		const result = await this.entityManager.query(
			`CALL SP_ABM_GUIAS_X_ACTIVIDAD(?, ?, ?, ?, ?, ?)`,
			[
				guiaDto.id_oferta,
				guiaDto.nro_resolucion,
				guiaDto.nombre_y_apellido,
				id_usuario,
				guiaDto.id_guia,
				0,
			],
		);
		return result[0][0];
	}

	async eliminarGuia(id_usuario: string, eliminarGuiaDto: EliminarGuiaDto) {
		const result = await this.entityManager.query(
			`CALL SP_ABM_GUIAS_X_ACTIVIDAD(?, ?, ?, ?, ?, ?)`,
			[
				eliminarGuiaDto.id_oferta,
				null,
				null,
				id_usuario,
				eliminarGuiaDto.id_guia,
				1,
			],
		);
		return result[0];
	}

	async actualizarActividad(id_usuario: string, actividadDto: ActividadDto) {
		const { politicas_reserva } = actividadDto;
		const resultados = { actividad: null, metodos_pago: null };

		await this.entityManager.transaction(async (manager) => {
			const resultado_actividad = await manager.query(
				'CALL SP_ABM_ACTIVIDAD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					actividadDto.id_oferta,
					actividadDto.id_sub_tipo_oferta,
					actividadDto.id_sub_categoria,
					actividadDto.nombre_actividad,
					actividadDto.descripcion_actividad,
					actividadDto.requisitos_actividad,
					id_usuario,
					politicas_reserva.id_politica_cancelacion,
					politicas_reserva.plazo_dias_cancelacion,
					politicas_reserva.id_tipo_pago_anticipado,
					null,
					politicas_reserva.porcentaje_pago_anticipado,
					actividadDto.id_dificultad,
					actividadDto.duracion_actividad,
					actividadDto.distancia_actividad,
					actividadDto.bl_con_guia,
					0,
				],
			);
			resultados.actividad = resultado_actividad[0][0];

			const resultado_metodos_pago = await manager.query(
				`CALL SP_ABM_METODOS_PAGO_X_OFERTA(?, ?, ?)`,
				[
					actividadDto.id_oferta,
					actividadDto.metodos_de_pago.join(','),
					id_usuario,
				],
			);
			resultados.metodos_pago = resultado_metodos_pago[0][0];
		});
		return resultados;
	}

	async obtenerImagenes(id_oferta: string) {
		const result = await this.entityManager.query(
			`CALL SP_OBT_IMAGENES_X_OFERTA(?)`,
			[id_oferta],
		);
		return result[0];
	}

	async obtenerDatosRegistradosActividad(id_oferta: string) {
		const resultados = {
			datos_basicos: null,
			metodos_pago: null,
			guias: null,
		};
		await this.entityManager.transaction(async (manager) => {
			const resultado_actividad = await manager.query(
				`CALL SP_OBT_INFO_ACTIVIDAD(?)`,
				[id_oferta],
			);
			const resultado_guias = await manager.query(
				`CALL SP_OBT_GUIAS_X_ACTIVIDAD(?)`,
				[id_oferta],
			);
			resultados.datos_basicos = resultado_actividad[0][0];
			resultados.metodos_pago = resultado_actividad[1];
			resultados.guias = resultado_guias[0];
		});
		return resultados;
	}
}
