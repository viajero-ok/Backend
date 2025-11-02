import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { EventoRepositoryService } from './evento-repository.service';

@Injectable()
export class EventoService {
	constructor(
		private readonly eventoRepositoryService: EventoRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerCategoriasEvento() {
		const result =
			await this.eventoRepositoryService.obtenerCategoriasEvento();

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener las categorías de eventos',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	// async guardarDatosBasicos(
	// 	req,
	// 	datosBasicosDto: GuardarDatosBasicosEventoDto,
	// ) {
	// 	const result = await this.eventoRepositoryService.guardarDatosBasicos(
	// 		req.user.id_usuario,
	// 		datosBasicosDto,
	// 	);

	// 	this.exceptionHandlingService.handleError(
	// 		result,
	// 		'Error al guardar los datos básicos del evento',
	// 		HttpStatus.CONFLICT,
	// 	);

	// 	return {
	// 		resultado: 'ok',
	// 		statusCode: HttpStatus.OK,
	// 	};
	// }
}
