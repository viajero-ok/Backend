import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { UbicacionCampingDto } from './dto/ubicacion-camping.dto';
import { PestañaUbicacionRepositoryService } from './pestaña-ubicacion-repository.service';

@Injectable()
export class PestañaUbicacionService {
	constructor(
		private readonly pestañaUbicacionRepositoryService: PestañaUbicacionRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarUbicacionCamping(req, ubicacionDto: UbicacionCampingDto) {
		const result =
			await this.pestañaUbicacionRepositoryService.registrarUbicacionCamping(
				req.user.id_usuario,
				ubicacionDto,
			);

		this.exceptionHandlingService.handleError(
			result.ubicacion,
			'Error al registrar la ubicación del camping',
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
			await this.pestañaUbicacionRepositoryService.obtenerUbicacionEstablecimiento(
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
			await this.pestañaUbicacionRepositoryService.obtenerDatosRegistradosUbicacion(
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
