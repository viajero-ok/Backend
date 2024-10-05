import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ActividadesRepositoryService } from './actividades-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { GuiaDto } from './dto/pestaña-actividad/guia.dto';
import { EliminarGuiaDto } from './dto/pestaña-actividad/eliminar-guia.dto';
import { ActividadDto } from './dto/pestaña-actividad/actividad.dto';
import { UbicacionActividadDto } from './dto/pestaña-ubicacion/ubicacion-actividad.dto';
import { HorarioVacioDto } from './dto/pestaña-tarifas/horario-vacio.dto';
import { HorariosOfertaDto } from './dto/pestaña-tarifas/horarios-oferta.dto';
import { TarifasValidator } from './utils/tarifas.validator';
import { TarifasDto } from './dto/pestaña-tarifas/tarifa.dto';

@Injectable()
export class ActividadesService {
	constructor(
		private readonly actividadesRepositoryService: ActividadesRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
		private readonly tarifasValidator: TarifasValidator,
	) {}

	async obtenerDatosRegistroActividades() {
		const result =
			await this.actividadesRepositoryService.obtenerDatosRegistroActividades();

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener los datos de registro de actividades',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async registrarGuia(req, guiaDto: GuiaDto) {
		const result = await this.actividadesRepositoryService.registrarGuia(
			req.user.id_usuario,
			guiaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar el guia',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
			id_guia: result.id_guia,
		};
	}

	async eliminarGuia(req, eliminarGuiaDto: EliminarGuiaDto) {
		const result = await this.actividadesRepositoryService.eliminarGuia(
			req.user.id_usuario,
			eliminarGuiaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar el guia',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.OK,
		};
	}

	async actualizarActividad(req, actividadDto: ActividadDto) {
		const result =
			await this.actividadesRepositoryService.actualizarActividad(
				req.user.id_usuario,
				actividadDto,
			);

		this.exceptionHandlingService.handleError(
			result.actividad,
			'Error al registrar la actividad',
			HttpStatus.CONFLICT,
		);

		this.exceptionHandlingService.handleError(
			result.metodos_pago,
			'Error al registrar los métodos de pago',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
			id_oferta: result.actividad.id_oferta,
		};
	}

	async eliminarActividad(req, id_oferta: string) {
		const result =
			await this.actividadesRepositoryService.eliminarActividad(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar la actividad',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.OK,
		};
	}

	async registrarUbicacionActividad(
		req,
		ubicacionDto: UbicacionActividadDto,
	) {
		const result =
			await this.actividadesRepositoryService.registrarUbicacionActividad(
				req.user.id_usuario,
				ubicacionDto,
			);

		this.exceptionHandlingService.handleError(
			result.ubicacion,
			'Error al registrar la ubicación de la actividad',
			HttpStatus.CONFLICT,
		);

		this.exceptionHandlingService.handleError(
			result.observacion,
			'Error al registrar la ubicación de la actividad',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
		};
	}

	async registrarHorario(req, horarioVacioDto: HorarioVacioDto) {
		const result =
			await this.actividadesRepositoryService.registrarHorario(
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
			await this.actividadesRepositoryService.eliminarHorario(id_horario);

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

	async finalizarRegistroActividad(
		req,
		horariosOfertaDto: HorariosOfertaDto,
	) {
		const resultados =
			await this.actividadesRepositoryService.finalizarRegistroActividad(
				req.user.id_usuario,
				horariosOfertaDto,
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

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	async registrarTarifa(req, tarifaDto: TarifasDto) {
		const tarifasExistentes =
			await this.actividadesRepositoryService.obtenerTarifas(
				tarifaDto.id_oferta,
			);

		const errores = await this.tarifasValidator.validarTarifa(
			tarifaDto,
			tarifasExistentes,
		);

		if (errores.length > 0) {
			throw new HttpException(
				{
					message: errores,
					statusCode: HttpStatus.CONFLICT,
				},
				HttpStatus.CONFLICT,
			);
		}

		const result = await this.actividadesRepositoryService.registrarTarifa(
			req.user.id_usuario,
			tarifaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar tarifa',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_tarifa: result.id_tarifa,
		};
	}

	async eliminarTarifa(req, id_tarifa: string) {
		return await this.actividadesRepositoryService.eliminarTarifa(
			req.user.id_usuario,
			id_tarifa,
		);
	}
}
