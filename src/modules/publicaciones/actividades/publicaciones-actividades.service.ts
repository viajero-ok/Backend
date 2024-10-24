import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesActividadesRepositoryService } from './publicaciones-actividades-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { TarifasValidator } from './utils/tarifas.validator';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';

@Injectable()
export class PublicacionesActividadesService {
	constructor(
		private readonly publicacionesActividadesRepositoryService: PublicacionesActividadesRepositoryService,
		private readonly tarifasValidator: TarifasValidator,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerDatosPublicacionActividad(id_oferta: string) {
		const resultado =
			await this.publicacionesActividadesRepositoryService.obtenerDatosPublicacionActividad(
				id_oferta,
			);

		return { tipos_detalle: resultado };
	}

	async registrarTarifa(req, registrarTarifasDto: RegistrarTarifasDto) {
		const tarifasExistentes =
			await this.publicacionesActividadesRepositoryService.obtenerTarifas(
				registrarTarifasDto.id_oferta,
			);

		const errores = await this.tarifasValidator.validarTarifa(
			registrarTarifasDto,
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
				registrarTarifasDto,
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

	async actualizarTarifa(req, actualizarTarifasDto: ActualizarTarifasDto) {
		const tarifasExistentes =
			await this.publicacionesActividadesRepositoryService.obtenerTarifas(
				actualizarTarifasDto.id_oferta,
			);

		const errores = await this.tarifasValidator.validarTarifa(
			actualizarTarifasDto,
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
			await this.publicacionesActividadesRepositoryService.actualizarTarifa(
				req.user.id_usuario,
				actualizarTarifasDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar tarifa',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	async eliminarTarifa(req, id_tarifa: string) {
		const result =
			await this.publicacionesActividadesRepositoryService.eliminarTarifa(
				req.user.id_usuario,
				id_tarifa,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar tarifa',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	async obtenerDatosRegistradosTarifa(req, id_oferta: string) {
		const result =
			await this.publicacionesActividadesRepositoryService.obtenerDatosRegistradosTarifa(
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener datos registrados de tarifa',
			HttpStatus.CONFLICT,
		);

		return {
			datos: result,
		};
	}
}
