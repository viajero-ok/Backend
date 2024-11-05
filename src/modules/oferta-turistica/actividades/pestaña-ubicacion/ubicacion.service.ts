import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UbicacionRepositoryService } from './ubicacion-repository.service';
import { UbicacionActividadDto } from './dto/ubicacion-actividad.dto';

@Injectable()
export class UbicacionService {
	constructor(
		private readonly ubicacionRepositoryService: UbicacionRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarUbicacionActividad(
		req,
		ubicacionDto: UbicacionActividadDto,
	) {
		const result =
			await this.ubicacionRepositoryService.registrarUbicacionActividad(
				req.user.id_usuario,
				ubicacionDto,
			);

		this.exceptionHandlingService.handleError(
			result.ubicacion,
			'Error al registrar la ubicación de la actividad',
			HttpStatus.CONFLICT,
		);

		if (result.observacion) {
			this.exceptionHandlingService.handleError(
				result.observacion,
				'Error al registrar la ubicación de la actividad',
				HttpStatus.CONFLICT,
			);
		}

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
		};
	}

	async obtenerDatosRegistradosUbicacion(req, id_oferta: string) {
		const result =
			await this.ubicacionRepositoryService.obtenerDatosRegistradosUbicacion(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener los datos de registro de ubicaciones',
			HttpStatus.CONFLICT,
		);

		return { datos_ubicacion: result };
	}
}
