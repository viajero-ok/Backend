import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GuiaDto } from './dto/pestaña-actividad/guia.dto';
import { EliminarGuiaDto } from './dto/pestaña-actividad/eliminar-guia.dto';
import { ActividadDto } from './dto/pestaña-actividad/actividad.dto';
import { TipoObservacion } from '../enum/tipo-observacion.enum';
import { UbicacionActividadDto } from './dto/pestaña-ubicacion/ubicacion-actividad.dto';
import { HorarioVacioDto } from './dto/pestaña-tarifas/horario-vacio.dto';
import { HorariosOfertaDto } from './dto/pestaña-tarifas/horarios-oferta.dto';
import { TarifasDto } from './dto/pestaña-tarifas/tarifa.dto';

@Injectable()
export class ActividadesRepositoryService {
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
		};
		await this.entityManager.transaction(async (manager: EntityManager) => {
			const tipos_subtipos = await manager.query(
				`CALL SP_LISTAR_TIPOS_SUBTIPOS_OFERTA()`,
			);
			resultados.tipos_y_subtipos.tipos = tipos_subtipos[0];
			resultados.tipos_y_subtipos.subtipos = tipos_subtipos[1];

			const sub_categorias_actividades = await manager.query(
				`CALL SP_LISTAR_SUBCATEGORIAS_ACTIVIDADES()`,
			);
			resultados.sub_categorias_actividades =
				sub_categorias_actividades[0];

			const dificultad_actividades = await manager.query(
				`CALL SP_LISTAR_DIFICULTAD_ACTIVIDAD()`,
			);
			resultados.dificultad_actividades = dificultad_actividades[0];
		});
		return resultados;
	}

	async registrarGuia(id_usuario: string, guiaDto: GuiaDto) {
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
					politicas_reserva.monto_pago_anticipado
						? 2
						: politicas_reserva.porcentaje_pago_anticipado
							? 1
							: 3,
					politicas_reserva.monto_pago_anticipado,
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
				`CALL SP_ABM_METODOS_PAGO_X_OFERTA(?, ?, ?, ?)`,
				[
					actividadDto.id_oferta,
					actividadDto.metodos_de_pago.join(','),
					id_usuario,
					0,
				],
			);
			resultados.metodos_pago = resultado_metodos_pago[0][0];
		});
		return resultados;
	}

	async eliminarActividad(id_usuario: string, id_oferta: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_ACTIVIDAD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id_oferta,
				null,
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
				null,
				1,
			],
		);
		return result[0];
	}

	async registrarUbicacionActividad(
		id_usuario: string,
		ubicacionDto: UbicacionActividadDto,
	) {
		const resultados = { ubicacion: null, observacion: null };
		await this.entityManager.transaction(async (manager) => {
			const resultado_ubicacion = manager.query(
				'CALL SP_ABM_DOMICILIO_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					ubicacionDto.id_oferta,
					ubicacionDto.calle,
					ubicacionDto.numero,
					ubicacionDto.id_localidad,
					ubicacionDto.id_departamento,
					ubicacionDto.sin_numero,
					ubicacionDto.latitud,
					ubicacionDto.longitud,
					0,
				],
			);
			resultados.ubicacion = resultado_ubicacion[0][0];
			const resultado_observacion = manager.query(
				'CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?, ?, ?)',
				[
					ubicacionDto.id_oferta,
					TipoObservacion.NORMAS,
					ubicacionDto.observaciones,
					id_usuario,
					0,
				],
			);
			resultados.observacion = resultado_observacion[0][0];
		});
		return resultados;
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

	async obtenerTarifas(id_tipo_detalle: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_TARIFA_X_TIPO_DETALLE(?)',
			[id_tipo_detalle],
		);
		return result[0];
	}

	async registrarTarifa(id_usuario: string, tarifa: TarifasDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				tarifa.id_tarifa,
				tarifa.id_oferta,
				tarifa.id_tipo_entrada,
				tarifa.monto_tarifa,
				tarifa.fecha_desde,
				tarifa.fecha_hasta,
				id_usuario,
				0,
				tarifa.edad_desde,
				tarifa.edad_hasta,
			],
		);
		return result[0][0];
	}

	async eliminarTarifa(id_tarifa: string, id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TARIFA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id_tarifa,
				null,
				null,
				null,
				null,
				null,
				id_usuario,
				1,
				null,
				null,
			],
		);
		return result[0][0];
	}

	async finalizarRegistroActividad(
		id_usuario: string,
		horariosOfertaDto: HorariosOfertaDto,
	) {
		const resultados = { horarios: [], registro_actividad: null };
		await this.entityManager.transaction(async (manager) => {
			for (const horario of horariosOfertaDto.check_in_out) {
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
						horariosOfertaDto.id_oferta,
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
			const resultado_actividad = await manager.query(
				`CALL SP_REGISTRAR_ACTIVIDAD(?, ?)`,
				[horariosOfertaDto.id_oferta, id_usuario],
			);
			resultados.registro_actividad = resultado_actividad[0][0];
		});
		return resultados;
	}
}
