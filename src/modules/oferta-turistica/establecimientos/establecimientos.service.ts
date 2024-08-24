import { HttpStatus, Injectable } from '@nestjs/common';
import { EstablecimientoDto } from './dto/establecimiento.dto';
import { EstablecimientosRepositoryService } from './establecimientos-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';

@Injectable()
export class EstablecimientosService {
	constructor(
		private readonly establecimientosRepositoryService: EstablecimientosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}
	async registrarEstablecimiento(
		req,
		establecimientoDto: EstablecimientoDto,
	) {
		const result =
			await this.establecimientosRepositoryService.registrarEstablecimiento(
				req.user.id_usuario,
				establecimientoDto,
			);
		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar establecimiento',
			HttpStatus.CONFLICT,
		);
		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	async obtenerEstablecimientosPorPrestador(req) {
		const result =
			await this.establecimientosRepositoryService.obtenerEstablecimientosPorPrestador(
				req.user.id_usuario,
			);
		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener establecimientos',
			HttpStatus.CONFLICT,
		);
		return {
			resultado: 'ok',
			statusCode: 200,
			establecimientos: result,
		};
	}
}
