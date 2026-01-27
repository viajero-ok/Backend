import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { PestañaDatosBasicosRepositoryService } from './pestaña-datos-basicos-repository.service';
import { DatosBasicosCampingDto } from './dto/datos-basicos-camping.dto';

@Injectable()
export class PestañaDatosBasicosService {
	constructor(
		private readonly pestañaDatosBasicosRepositoryService: PestañaDatosBasicosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async actualizarDatosBasicos(
		req,
		datosBasicosCampingDto: DatosBasicosCampingDto,
	) {
		try {
			const resultados =
				await this.pestañaDatosBasicosRepositoryService.actualizarDatosBasicos(
					req.user.id_usuario,
					datosBasicosCampingDto,
				);

			// Verificar resultados individuales
			this.exceptionHandlingService.handleError(
				resultados.alojamiento,
				'Error al registrar datos básicos del camping',
				HttpStatus.CONFLICT,
			);
			this.exceptionHandlingService.handleError(
				resultados.caracteristicas,
				'Error al registrar características del camping',
				HttpStatus.CONFLICT,
			);
			this.exceptionHandlingService.handleError(
				resultados.metodos_pago,
				'Error al registrar métodos de pago del camping',
				HttpStatus.CONFLICT,
			);

			resultados.observaciones.forEach((observacion, index) => {
				this.exceptionHandlingService.handleError(
					observacion,
					`Error al registrar observación ${index + 1}`,
					HttpStatus.CONFLICT,
				);
			});

			return {
				resultado: 'ok',
				statusCode: 201,
				id_oferta: resultados.alojamiento.id_oferta,
			};
		} catch (error) {
			throw error;
		}
	}

	async obtenerDatosRegistroCamping() {
		return await this.pestañaDatosBasicosRepositoryService.obtenerDatosRegistroCamping();
	}

	async obtenerDatosRegistradosCamping(req, id_oferta: string) {
		const result =
			await this.pestañaDatosBasicosRepositoryService.obtenerDatosRegistradosCamping(
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener datos registrados del camping',
			HttpStatus.CONFLICT,
		);

		return {
			datos: result,
		};
	}
}
