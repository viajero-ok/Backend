import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { EntradaDto, EntradaNuevaDto } from './dto/entradas.dto';
import { FinalizarRegistroDto } from './dto/finalizar-registro.dto';
import { HorariosTurnosNuevoDto } from './dto/horario-nuevo.dto';
import { HorariosTurnosDto } from './dto/horarios.dto';
import { HorariosEntradasRepositoryService } from './horarios-entradas-repository.service';

@Injectable()
export class HorariosEntradasService {
	constructor(
		private readonly horariosEntradasRepositoryService: HorariosEntradasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarHorario(_, horarioNuevoDto: HorariosTurnosNuevoDto) {
		const result =
			await this.horariosEntradasRepositoryService.registrarHorario({
				...horarioNuevoDto,
				dias_semana: !horarioNuevoDto.aplica_todos_los_dias
					? horarioNuevoDto.dias_semana
					: {
							aplica_lunes: true,
							aplica_martes: true,
							aplica_miercoles: true,
							aplica_jueves: true,
							aplica_viernes: true,
							aplica_sabado: true,
							aplica_domingo: true,
						},
			});

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar horario',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_horario: result.id_horario,
		};
	}

	async actualizarHorario(_, horarioDto: HorariosTurnosDto) {
		const result =
			await this.horariosEntradasRepositoryService.actualizarHorario({
				...horarioDto,
				dias_semana: !horarioDto.aplica_todos_los_dias
					? horarioDto.dias_semana
					: {
							aplica_lunes: true,
							aplica_martes: true,
							aplica_miercoles: true,
							aplica_jueves: true,
							aplica_viernes: true,
							aplica_sabado: true,
							aplica_domingo: true,
						},
			});

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar horario',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	async eliminarHorario(req, id_horario: string) {
		const result =
			await this.horariosEntradasRepositoryService.eliminarHorario(
				id_horario,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar horario',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async registrarEntrada(req, entradaNueva: EntradaNuevaDto) {
		const result =
			await this.horariosEntradasRepositoryService.registrarEntrada(
				req.user.id_usuario,
				entradaNueva,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar la entrada',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_entrada: result.id_tipo_entrada,
		};
	}

	async actualizarEntrada(req, entrada: EntradaDto) {
		const result =
			await this.horariosEntradasRepositoryService.actualizarEntrada(
				req.user.id_usuario,
				entrada,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al actualizar la entrada',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_entrada: result.id_tipo_entrada,
		};
	}

	async eliminarEntrada(req, id_entrada: string) {
		const result =
			await this.horariosEntradasRepositoryService.eliminarEntrada(
				req.user.id_usuario,
				id_entrada,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar la entrada',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async finalizarRegistroActividad(
		req,
		finalizarRegistroDto: FinalizarRegistroDto,
	) {
		const resultados =
			await this.horariosEntradasRepositoryService.finalizarRegistroActividad(
				req.user.id_usuario,
				finalizarRegistroDto,
			);

		resultados.horarios.forEach((horario, index) => {
			this.exceptionHandlingService.handleError(
				horario,
				`Error al registrar horario ${index + 1}`,
				HttpStatus.CONFLICT,
			);
		});

		this.exceptionHandlingService.handleError(
			resultados.registro_actividad,
			'Error al registrar la actividad',
			HttpStatus.CONFLICT,
		);

		resultados.entradas.forEach((entrada, index) => {
			this.exceptionHandlingService.handleError(
				entrada,
				`Error al registrar la entrada ${index + 1}`,
				HttpStatus.CONFLICT,
			);
		});

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	async obtenerDatosRegistradosHorariosYEntradas(req, id_oferta: string) {
		const result =
			await this.horariosEntradasRepositoryService.obtenerDatosRegistradosHorariosYEntradas(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener los datos registrados de horarios y entradas',
			HttpStatus.CONFLICT,
		);

		return { datos_horarios_entradas: result };
	}
}
