import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EstablecimientoDto } from './dto/establecimiento.dto';
import { EstablecimientosRepositoryService } from './establecimientos-repository.service';

@Injectable()
export class EstablecimientosService {
	constructor(
		private readonly establecimientosRepositoryService: EstablecimientosRepositoryService,
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
		if (result.resultado == 'error') {
			throw new HttpException(
				'Error al registrar establecimiento',
				HttpStatus.CONFLICT,
			);
		}
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
		if (result.resultado == 'error') {
			throw new HttpException(
				'Error al registrar establecimiento',
				HttpStatus.CONFLICT,
			);
		}
		return {
			resultado: 'ok',
			statusCode: 200,
			establecimientos: result,
		};
	}
}
