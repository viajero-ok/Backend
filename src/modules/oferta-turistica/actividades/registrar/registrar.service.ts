import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { RegistrarRepositoryService } from './registrar-repository.service';

@Injectable()
export class RegistrarService {
	constructor(
		private readonly registrarRepositoryService: RegistrarRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarActividad(req, id_oferta: string) {
		const result = await this.registrarRepositoryService.registrarActividad(
			req.user.id_usuario,
			id_oferta,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar la actividad',
			HttpStatus.CONFLICT,
		);

		return result;
	}
}
