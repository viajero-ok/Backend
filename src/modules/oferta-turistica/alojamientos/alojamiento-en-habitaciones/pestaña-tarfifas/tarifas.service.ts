import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { TarifasValidator } from '../utils/tarifas.validator';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { TarifasRepositoryService } from './tarifas-repository.service';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';

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

	async registrarTarifa(req, tarifasDto: RegistrarTarifasDto) {
		const result = await this.tarifasRepositoryService.registrarTarifa(
			req.user.id_usuario,
			tarifasDto,
		);
		console.log(result);
		for (const tarifa of result) {
			this.exceptionHandlingService.handleError(
				tarifa,
				'Error al registrar tarifa',
				HttpStatus.CONFLICT,
			);
		}
		const datos = result.map((tarifa) => {
			return {
				id_tarifa: tarifa.id_tarifa,
				id_tipo_detalle: tarifa.id_tipo_detalle,
			};
		});

		return {
			resultado: 'ok',
			statusCode: 201,
			datos: datos,
		};
	}

	async actualizarTarifa(req, actualizarTarifasDto: ActualizarTarifasDto) {
		const result = await this.tarifasRepositoryService.actualizarTarifa(
			req.user.id_usuario,
			actualizarTarifasDto,
		);

		for (const tarifa of result) {
			this.exceptionHandlingService.handleError(
				tarifa,
				'Error al registrar tarifa',
				HttpStatus.CONFLICT,
			);
		}
		const datos = result.map((tarifa) => {
			return {
				id_tarifa: tarifa.id_tarifa,
				id_tipo_detalle: tarifa.id_tipo_detalle,
			};
		});

		return {
			resultado: 'ok',
			statusCode: 201,
			datos: datos,
		};
	}

	async eliminarTarifa(req, id_tarifa: number) {
		const result = await this.tarifasRepositoryService.eliminarTarifa(
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
