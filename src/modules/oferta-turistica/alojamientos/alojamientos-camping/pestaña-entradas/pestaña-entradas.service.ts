import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import {
	EntradaCampingDto,
	EntradaCampingNuevaDto,
} from './dto/entrada-camping.dto';
import { PestañaEntradasRepositoryService } from './pestaña-entradas-repository.service';

@Injectable()
export class PestañaEntradasService {
	constructor(
		private readonly pestañaEntradasRepositoryService: PestañaEntradasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarEntrada(req, entradaNueva: EntradaCampingNuevaDto) {
		const result =
			await this.pestañaEntradasRepositoryService.registrarEntrada(
				req.user.id_usuario,
				entradaNueva,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar tipo de entrada',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_entrada: result.id_tipo_entrada,
		};
	}

	async actualizarEntrada(req, entrada: EntradaCampingDto) {
		const result =
			await this.pestañaEntradasRepositoryService.actualizarEntrada(
				req.user.id_usuario,
				entrada,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al actualizar tipo de entrada',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
			id_entrada: result.id_tipo_entrada,
		};
	}

	async eliminarEntrada(req, id_entrada: string) {
		const result =
			await this.pestañaEntradasRepositoryService.eliminarEntrada(
				req.user.id_usuario,
				id_entrada,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar tipo de entrada',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async obtenerEntradasRegistradas(req, id_oferta: string) {
		const result =
			await this.pestañaEntradasRepositoryService.obtenerEntradasRegistradas(
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener tipos de entradas registradas',
			HttpStatus.CONFLICT,
		);

		return {
			datos_entradas: result,
		};
	}
}
