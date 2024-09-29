import { HttpStatus, Injectable } from '@nestjs/common';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { DetalleAlojamientoDto } from '../dto/detalle-alojamiento.dto';

@Injectable()
export class AlojamientosService {
	constructor(
		private readonly alojamientosRepositoryService: AlojamientosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async actualizarAlojamiento(req, alojamientoDto: AlojamientoDto) {
		try {
			const resultados =
				await this.alojamientosRepositoryService.actualizarAlojamiento(
					req.user.id_usuario,
					alojamientoDto,
				);
			// Verificar resultados individuales
			this.exceptionHandlingService.handleError(
				resultados.alojamiento,
				'Error al registrar alojamiento',
				HttpStatus.CONFLICT,
			);
			this.exceptionHandlingService.handleError(
				resultados.caracteristicas,
				'Error al registrar características del alojamiento',
				HttpStatus.CONFLICT,
			);
			this.exceptionHandlingService.handleError(
				resultados.metodos_pago,
				'Error al registrar métodos de pago del alojamiento',
				HttpStatus.CONFLICT,
			);

			resultados.observaciones.forEach((observacion, index) => {
				this.exceptionHandlingService.handleError(
					observacion,
					`Error al registrar observación ${index + 1}`,
					HttpStatus.CONFLICT,
				);
			});

			resultados.horarios.forEach((horario, index) => {
				this.exceptionHandlingService.handleError(
					horario,
					`Error al registrar horario ${index + 1}`,
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

	async obtenerDatosRegistroAlojamiento() {
		return await this.alojamientosRepositoryService.obtenerDatosRegistroAlojamiento();
	}

	async eliminarAlojamiento(req, id_oferta: string) {
		const result =
			await this.alojamientosRepositoryService.eliminarAlojamiento(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar alojamiento',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async finalizarRegistroAlojamiento(
		req,
		detalleAlojamientoDto: DetalleAlojamientoDto,
	) {
		const result =
			await this.alojamientosRepositoryService.finalizarRegistroAlojamiento(
				req.user.id_usuario,
				detalleAlojamientoDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al finalizar el registro del alojamiento',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}
}
