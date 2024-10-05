import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { TarifasValidator } from '../utils/tarifas.validator';
import { TarifasDto } from './dto/tarifa.dto';
import { TarifasRepositoryService } from './tarifas-repository.service';
import { RegistrarTarifaDto } from './dto/registrar-tarifa-dto';

@Injectable()
export class TarifasService {
	constructor(
		private readonly tarifasRepositoryService: TarifasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
		private readonly tarifasValidator: TarifasValidator,
	) {}

	async obtenerDatosRegistroTarifa() {
		return await this.tarifasRepositoryService.obtenerDatosRegistroTarifa();
	}

	async registrarTarifa(req, registrarTarifaDto: RegistrarTarifaDto) {
		const result = await this.tarifasRepositoryService.registrarTarifa(
			req.user.id_usuario,
			registrarTarifaDto,
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

	async actualizarTarifa(req, tarifaDto: TarifasDto) {
		const tarifasExistentes =
			await this.tarifasRepositoryService.obtenerTarifas(
				tarifaDto.id_tipo_detalle,
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

		const result = await this.tarifasRepositoryService.actualizarTarifa(
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
		return await this.tarifasRepositoryService.eliminarTarifa(
			req.user.id_usuario,
			id_tarifa,
		);
	}

	async obtenerDatosRegistradosTarifa(req, id_oferta: string) {
		const result =
			await this.tarifasRepositoryService.obtenerDatosRegistradosTarifa(
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
