import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesAlojamientosRepositoryService } from './publicaciones-alojamientos-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';
import { TarifasValidator } from './utils/tarifas.validator';

@Injectable()
export class PublicacionesAlojamientosService {
	constructor(
		private readonly publicacionesAlojamientosRepositoryService: PublicacionesAlojamientosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
		private readonly tarifasValidator: TarifasValidator,
	) {}

	async obtenerDatosPublicacionAlojamiento(id_oferta: string) {
		const resultado =
			await this.publicacionesAlojamientosRepositoryService.obtenerDatosPublicacionAlojamiento(
				id_oferta,
			);

		return { tipos_detalle: resultado };
	}

	async registrarTarifa(req, registrarTarifasDto: RegistrarTarifasDto) {
		const tarifasExistentes =
			await this.publicacionesAlojamientosRepositoryService.obtenerTarifas(
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
			await this.publicacionesAlojamientosRepositoryService.registrarTarifa(
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
			await this.publicacionesAlojamientosRepositoryService.obtenerTarifas(
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
			await this.publicacionesAlojamientosRepositoryService.actualizarTarifa(
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

	async eliminarTarifa(req, id_tarifa: number) {
		const result =
			await this.publicacionesAlojamientosRepositoryService.eliminarTarifa(
				id_tarifa,
				req.user.id_usuario,
			);
		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar tarifa',
			HttpStatus.CONFLICT,
		);
		return {
			resultado: 'ok',
			statusCode: 200,
			id_tarifa: result.id_tarifa,
		};
	}

	async obtenerDatosRegistradosTarifa(req, id_oferta: string) {
		const result =
			await this.publicacionesAlojamientosRepositoryService.obtenerDatosRegistradosTarifa(
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
