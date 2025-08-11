import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { GuiasRepositoryService } from './guias-repository.service';

@Injectable()
export class GuiasService {
	constructor(
		private readonly guiasRepositoryService: GuiasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerGuias(id_oferta: string) {
		const result =
			await this.guiasRepositoryService.obtenerGuias(id_oferta);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener los guías registrados para la actividad',
			HttpStatus.CONFLICT,
		);

		return result;
	}
}
