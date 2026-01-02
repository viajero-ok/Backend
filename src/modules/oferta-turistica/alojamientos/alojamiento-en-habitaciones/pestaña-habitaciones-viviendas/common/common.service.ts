import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { CommonRepositoryService } from './common-repository.service';

@Injectable()
export class CommonService {
	constructor(
		private readonly commonRepositoryService: CommonRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async finalizarRegistroAlojamiento(req, id_oferta: string) {
		const result =
			await this.commonRepositoryService.finalizarRegistroAlojamiento(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			`Error al finalizar registro de alojamiento. ${JSON.stringify(result)}`,
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}
}
