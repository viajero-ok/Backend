import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { UbicacionActividadDto } from './dto/ubicacion-actividad.dto';
import { UbicacionRepositoryService } from './ubicacion-repository.service';

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
				'Error al registrar la observación de la ubicación',
				HttpStatus.CONFLICT,
			);
		}

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
		};
	}

	async obtenerUbicacionEstablecimiento(req, id_oferta: string) {
		const result =
			await this.ubicacionRepositoryService.obtenerUbicacionEstablecimiento(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener la ubicación del establecimiento asociado',
			HttpStatus.CONFLICT,
		);

		return { datos_ubicacion: result };
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
