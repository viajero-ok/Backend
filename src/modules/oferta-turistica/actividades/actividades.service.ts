import { HttpStatus, Injectable } from '@nestjs/common';
import { ActividadesRepositoryService } from './actividades-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { GuiaDto } from './dto/guia.dto';
import { EliminarGuiaDto } from './dto/eliminar-guia.dto';

@Injectable()
export class ActividadesService {
	constructor(
		private readonly actividadesRepositoryService: ActividadesRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerDatosRegistroActividades() {
		const result =
			await this.actividadesRepositoryService.obtenerDatosRegistroActividades();

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener los datos de registro de actividades',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async registrarGuia(req, guiaDto: GuiaDto) {
		const result = await this.actividadesRepositoryService.registrarGuia(
			req.user.id_usuario,
			guiaDto,
		);
		console.log(result);
		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar el guia',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
			id_guia: result.id_guia,
		};
	}

	async eliminarGuia(req, eliminarGuiaDto: EliminarGuiaDto) {
		const result = await this.actividadesRepositoryService.eliminarGuia(
			req.user.id_usuario,
			eliminarGuiaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar el guia',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.OK,
		};
	}
}
