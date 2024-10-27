import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HorarioVacioDto } from './dto/horario-vacio.dto';
import { EntradaVaciaDto } from './dto/entrada-vacia.dto';
import { FinalizarRegistroDto } from './dto/finalizar-registro.dto';

@Injectable()
export class HorariosEntradasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

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

	async registrarEntrada(
		id_usuario: string,
		entradaVaciaDto: EntradaVaciaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?)',
			[null, null, entradaVaciaDto.id_oferta, id_usuario, null, 0],
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
						cupo_maximo,
						null,
						0,
					],
				);
				resultados.horarios.push(resultado[0][0]);
			}
			const resultado_actividad = await manager.query(
				`CALL SP_REGISTRAR_ACTIVIDAD(?, ?)`,
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
}
