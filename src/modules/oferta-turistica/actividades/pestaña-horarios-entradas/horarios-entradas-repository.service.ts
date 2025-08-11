import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { EntradaDto, EntradaNuevaDto } from './dto/entradas.dto';
import { FinalizarRegistroDto } from './dto/finalizar-registro.dto';
import { HorariosTurnosNuevoDto } from './dto/horario-nuevo.dto';
import { HorariosTurnosDto } from './dto/horarios.dto';

@Injectable()
export class HorariosEntradasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarHorario(horarioNuevoDto: HorariosTurnosNuevoDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				horarioNuevoDto.id_oferta,
				horarioNuevoDto.check_in.hora_check_in,
				horarioNuevoDto.check_in.minuto_check_in,
				horarioNuevoDto.check_out.hora_check_out,
				horarioNuevoDto.check_out.minuto_check_out,
				horarioNuevoDto.dias_semana.aplica_lunes,
				horarioNuevoDto.dias_semana.aplica_martes,
				horarioNuevoDto.dias_semana.aplica_miercoles,
				horarioNuevoDto.dias_semana.aplica_jueves,
				horarioNuevoDto.dias_semana.aplica_viernes,
				horarioNuevoDto.dias_semana.aplica_sabado,
				horarioNuevoDto.dias_semana.aplica_domingo,
				null, // id_horario es null, por lo cual se hace un alta en BD
				horarioNuevoDto.cupo_maximo,
				horarioNuevoDto.cupo_maximo,
				horarioNuevoDto.bl_sin_cupo,
				0, // si es 1, se realiza una Baja; si es 0, se inserta o modifica
			],
		);
		return result[0][0];
	}

	async actualizarHorario(horarioDto: HorariosTurnosDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				horarioDto.id_oferta,
				horarioDto.check_in.hora_check_in,
				horarioDto.check_in.minuto_check_in,
				horarioDto.check_out.hora_check_out,
				horarioDto.check_out.minuto_check_out,
				horarioDto.dias_semana.aplica_lunes,
				horarioDto.dias_semana.aplica_martes,
				horarioDto.dias_semana.aplica_miercoles,
				horarioDto.dias_semana.aplica_jueves,
				horarioDto.dias_semana.aplica_viernes,
				horarioDto.dias_semana.aplica_sabado,
				horarioDto.dias_semana.aplica_domingo,
				horarioDto.id_horario, // id_horario es null, por lo cual se hace un alta en BD
				horarioDto.cupo_maximo,
				horarioDto.cupo_maximo,
				horarioDto.bl_sin_cupo,
				0, // si es 1, se realiza una Baja; si es 0, se inserta o modifica
			],
		);
		return result[0][0];
	}

	async eliminarHorario(id_horario: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
				null,
				1,
			],
		);
		return result[0][0];
	}

	async registrarEntrada(id_usuario: string, entradaNueva: EntradaNuevaDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?)',
			[
				entradaNueva.nombre,
				entradaNueva.descripcion,
				entradaNueva.id_oferta,
				id_usuario,
				null, // id_entrada, para baja y modificación
				0, // Bandera para baja
			],
		);
		return result[0][0];
	}

	async actualizarEntrada(id_usuario: string, entrada: EntradaDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?)',
			[
				entrada.nombre,
				entrada.descripcion,
				entrada.id_oferta,
				id_usuario,
				entrada.id_entrada, // id_entrada, para baja y modificación
				0, // Bandera para baja
			],
		);
		return result[0][0];
	}

	async eliminarEntrada(id_usuario: string, id_entrada: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?)',
			[null, null, null, id_usuario, id_entrada, 1],
		);
		return result[0][0];
	}

	async finalizarRegistroActividad(
		id_usuario: string,
		finalizarRegistroDto: FinalizarRegistroDto,
	) {
		const { id_oferta, entradas, horarios_turnos } = finalizarRegistroDto;
		const resultados = {
			horarios: [],
			entradas: [],
			registro_actividad: null,
		};
		await this.entityManager.transaction(async (manager) => {
			for (const horario of horarios_turnos) {
				const {
					check_in,
					check_out,
					dias_semana,
					aplica_todos_los_dias,
					cupo_maximo,
					bl_sin_cupo,
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
					`CALL SP_ABM_HORARIOS_CHECK(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						id_oferta,
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
						bl_sin_cupo === undefined || bl_sin_cupo === false
							? cupo_maximo
							: 0,
						null,
						bl_sin_cupo === undefined || bl_sin_cupo === false
							? false
							: bl_sin_cupo,
						0,
					],
				);
				resultados.horarios.push(resultado[0][0]);
			}
			const resultado_actividad = await manager.query(
				`CALL SP_REGISTRAR_OFERTA(?, ?)`,
				[id_oferta, id_usuario],
			);
			for (const entrada of entradas) {
				const resultado_entradas = await manager.query(
					`CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?)`,
					[
						entrada.nombre,
						entrada.descripcion,
						id_oferta,
						id_usuario,
						entrada.id_entrada,
						0,
					],
				);
				resultados.entradas.push(resultado_entradas[0][0]);
			}
			resultados.registro_actividad = resultado_actividad[0][0];
		});
		return resultados;
	}

	async obtenerDatosRegistradosHorariosYEntradas(
		id_usuario: string,
		id_oferta: string,
	) {
		const resultados = {
			horarios_turnos: [],
			entradas: [],
		};
		const resultado_entradas = await this.entityManager.query(
			`CALL SP_OBT_TIPOS_ENTRADA_X_OFERTA(?)`,
			[id_oferta],
		);
		resultados.entradas = resultado_entradas[0];
		const resultado_horarios = await this.entityManager.query(
			`CALL SP_OBT_HORARIOS_X_OFERTA(?)`,
			[id_oferta],
		);
		resultados.horarios_turnos = resultado_horarios[0].map(
			(horario: any) => ({
				...horario,
				aplica_lunes: horario.aplica_lunes ?? false,
				aplica_martes: horario.aplica_martes ?? false,
				aplica_miercoles: horario.aplica_miercoles ?? false,
				aplica_jueves: horario.aplica_jueves ?? false,
				aplica_viernes: horario.aplica_viernes ?? false,
				aplica_sabado: horario.aplica_sabado ?? false,
				aplica_domingo: horario.aplica_domingo ?? false,
				bl_sin_cupo: horario.bl_sin_cupo == 1 ? true : false,
			}),
		);
		return resultados;
	}
}
