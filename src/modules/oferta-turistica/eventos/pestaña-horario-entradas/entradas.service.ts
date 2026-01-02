import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import {
	EliminarEntradaDto,
	EntradaDto,
	ModificarEntradaDto,
} from './dto/entrada.dto';
import { EntradasRepositoryService } from './entradas-repository.service';

@Injectable()
export class EntradasService {
	constructor(
		private readonly entradaRepositoryService: EntradasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarEntrada(entradaDto: EntradaDto) {
		const result =
			await this.entradaRepositoryService.registrarEntrada(entradaDto);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar la entrada',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async modificarEntrada(entradaDto: ModificarEntradaDto) {
		const result =
			await this.entradaRepositoryService.modificarEntrada(entradaDto);

		this.exceptionHandlingService.handleError(
			result,
			'Error al modificar la entrada',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async eliminarEntrada(entradaDto: EliminarEntradaDto) {
		const result =
			await this.entradaRepositoryService.eliminarEntrada(entradaDto);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar la entrada',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async obtenerEntradas(id_oferta: string) {
		const result =
			await this.entradaRepositoryService.obtenerEntradas(id_oferta);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener las entradas',
			HttpStatus.CONFLICT,
		);

		return result;
	}
}
