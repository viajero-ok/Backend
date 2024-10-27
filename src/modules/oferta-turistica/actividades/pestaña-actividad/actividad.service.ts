import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ActividadRepositoryService } from './actividad-repository.service';
import { ActividadDto } from './dto/actividad.dto';
import { EliminarGuiaDto } from './dto/eliminar-guia.dto';
import { GuiaDto } from './dto/guia.dto';

@Injectable()
export class ActividadService {
	constructor(
		private readonly actividadRepositoryService: ActividadRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerDatosRegistroActividades() {
		const result =
			await this.actividadRepositoryService.obtenerDatosRegistroActividades();

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener los datos de registro de actividades',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async registrarGuia(req, guiaDto: GuiaDto) {
		const result = await this.actividadRepositoryService.registrarGuia(
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
		const result = await this.actividadRepositoryService.eliminarGuia(
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
			await this.actividadRepositoryService.actualizarActividad(
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
		const result = await this.actividadRepositoryService.eliminarActividad(
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
}
