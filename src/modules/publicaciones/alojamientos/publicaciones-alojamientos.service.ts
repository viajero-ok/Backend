import { HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesAlojamientosRepositoryService } from './publicaciones-alojamientos-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';

@Injectable()
export class PublicacionesAlojamientosService {
	constructor(
		private readonly publicacionesAlojamientosRepositoryService: PublicacionesAlojamientosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerDatosPublicacionAlojamiento(id_oferta: string) {
		return await this.publicacionesAlojamientosRepositoryService.obtenerDatosPublicacionAlojamiento(
			id_oferta,
		);
	}

	async registrarTarifa(req, tarifasDto: RegistrarTarifasDto) {
		const result =
			await this.publicacionesAlojamientosRepositoryService.registrarTarifa(
				req.user.id_usuario,
				tarifasDto,
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

	async actualizarTarifa(req, actualizarTarifasDto: ActualizarTarifasDto) {
		const result =
			await this.publicacionesAlojamientosRepositoryService.actualizarTarifa(
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
