import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { RedesSocialesRepositoryService } from './redes-sociales-repository.service';
import { EliminarRedSocialDto, NuevaRedSocialDto } from './dto/RedSocial.dto';

@Injectable()
export class RedesSocialesService {
	constructor(
		private readonly redesSocialesRepositoryService: RedesSocialesRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarRedSocial(nuevaRedSocialDto: NuevaRedSocialDto) {
		const result =
			await this.redesSocialesRepositoryService.registrarRedSocial(
				nuevaRedSocialDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar la red social',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async eliminarRedSocial(eliminarRedSocialDto: EliminarRedSocialDto) {
		const result =
			await this.redesSocialesRepositoryService.eliminarRedSocial(
				eliminarRedSocialDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar la red social',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async obtenerRedesSociales() {
		const result =
			await this.redesSocialesRepositoryService.obtenerRedesSociales();

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener las redes sociales',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.OK,
			redes_sociales: result,
		};
	}

	// async obtenerCategoriasEvento() {
	// 	const result =
	// 		await this.eventoRepositoryService.obtenerCategoriasEvento();

	// 	this.exceptionHandlingService.handleError(
	// 		result,
	// 		'Error al obtener las categorías de eventos',
	// 		HttpStatus.CONFLICT,
	// 	);

	// 	return result;
	// }

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

	// async obtenerDatosRegistrados(id_oferta: string) {
	// 	const result =
	// 		await this.eventoRepositoryService.obtenerDatosRegistrados(
	// 			id_oferta,
	// 		);

	// 	this.exceptionHandlingService.handleError(
	// 		result,
	// 		'Error al guardar los datos básicos del evento',
	// 		HttpStatus.CONFLICT,
	// 	);

	// 	return {
	// 		resultado: 'ok',
	// 		statusCode: HttpStatus.OK,
	// 		datos_registrados: result,
	// 	};
	// }
}
