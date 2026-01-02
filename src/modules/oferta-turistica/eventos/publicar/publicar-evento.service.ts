import { HttpStatus, Injectable } from '@nestjs/common';
import { PublicarEventoRepositoryService } from './publicar-evento.repository-service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';

@Injectable()
export class PublicarEventoService {
	constructor(
		private readonly publicarEventoRepositoryService: PublicarEventoRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async publicarEvento(id_oferta: string, id_usuario: string) {
		const result =
			await this.publicarEventoRepositoryService.publicarEvento(
				id_oferta,
				id_usuario,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al publicar el evento',
			HttpStatus.CONFLICT,
		);

		return result;
	}
}
