import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { HorariosEntradasRepositoryService } from './horarios-entradas-repository.service';
import { HorarioVacioDto } from './dto/horario-vacio.dto';
import { EntradaVaciaDto } from './dto/entrada-vacia.dto';
import { FinalizarRegistroDto } from './dto/finalizar-registro.dto';

@Injectable()
export class HorariosEntradasService {
	constructor(
		private readonly horariosEntradasRepositoryService: HorariosEntradasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarHorario(req, horarioVacioDto: HorarioVacioDto) {
		const result =
			await this.horariosEntradasRepositoryService.registrarHorario(
				horarioVacioDto,
			);

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

	async registrarEntrada(req, entradaVaciaDto: EntradaVaciaDto) {
		const result =
			await this.horariosEntradasRepositoryService.registrarEntrada(
				req.user.id_usuario,
				entradaVaciaDto,
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
