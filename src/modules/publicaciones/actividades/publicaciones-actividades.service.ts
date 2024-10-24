import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesActividadesRepositoryService } from './publicaciones-actividades-repository.service';
import { TarifasDto } from './dto/tarifa.dto';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { TarifasValidator } from './utils/tarifas.validator';

@Injectable()
export class PublicacionesActividadesService {
	constructor(
		private readonly publicacionesActividadesRepositoryService: PublicacionesActividadesRepositoryService,
		private readonly tarifasValidator: TarifasValidator,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarTarifa(req, tarifaDto: TarifasDto) {
		const tarifasExistentes =
			await this.publicacionesActividadesRepositoryService.obtenerTarifas(
				tarifaDto.id_oferta,
			);

		const errores = await this.tarifasValidator.validarTarifa(
			tarifaDto,
			tarifasExistentes,
		);

		if (errores.length > 0) {
			throw new HttpException(
				{
					message: errores,
					statusCode: HttpStatus.CONFLICT,
				},
				HttpStatus.CONFLICT,
			);
		}

		const result =
			await this.publicacionesActividadesRepositoryService.registrarTarifa(
				req.user.id_usuario,
				tarifaDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar tarifa',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_tarifa: result.id_tarifa,
		};
	}

	async eliminarTarifa(req, id_tarifa: string) {
		return await this.publicacionesActividadesRepositoryService.eliminarTarifa(
			req.user.id_usuario,
			id_tarifa,
		);
	}
}
