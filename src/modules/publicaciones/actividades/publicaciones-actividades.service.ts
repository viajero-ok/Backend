import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesActividadesRepositoryService } from './publicaciones-actividades-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { TarifasValidator } from './utils/tarifas.validator';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';
import { PeriodoSinTarifasValidator } from './utils/periodo-sin-tarifas.validator';
import { TipoPagoAnticipado } from '../enum/tipo_pago_anticipado.enum';

@Injectable()
export class PublicacionesActividadesService {
	constructor(
		private readonly publicacionesActividadesRepositoryService: PublicacionesActividadesRepositoryService,
		private readonly tarifasValidator: TarifasValidator,
		private readonly periodoSinTarifasValidator: PeriodoSinTarifasValidator,
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

	async eliminarTarifa(req, id_tarifa: number) {
		const result =
			await this.publicacionesActividadesRepositoryService.eliminarTarifa(
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

	async publicarActividad(req, id_oferta: string) {
		const resultado_tipo_pago_anticipado =
			await this.publicacionesActividadesRepositoryService.obtenerIdTipoPagoAnticipado(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			resultado_tipo_pago_anticipado,
			'Error al obtener el id del tipo de pago anticipado',
			HttpStatus.CONFLICT,
		);

		this.validarAutorizacionMercadoPago(
			resultado_tipo_pago_anticipado.id_tipo_pago_anticipado,
			resultado_tipo_pago_anticipado.fecha_expiracion_autorizacion_mp,
		);

		const tarifasExistentes =
			await this.publicacionesActividadesRepositoryService.obtenerTarifas(
				id_oferta,
			);

		const tipos_entradas =
			await this.publicacionesActividadesRepositoryService.obtenerDatosPublicacionActividad(
				id_oferta,
			);

		const errores =
			await this.periodoSinTarifasValidator.validarPeriodoSinTarifas(
				tarifasExistentes,
				tipos_entradas,
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
			await this.publicacionesActividadesRepositoryService.publicarActividad(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al publicar actividad',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	validarAutorizacionMercadoPago(
		id_tipo_pago_anticipado: number,
		fecha_expiracion_autorizacion_mp: number,
	) {
		const fecha_actual = new Date().getTime();
		if (
			(id_tipo_pago_anticipado === TipoPagoAnticipado.MONTO_TOTAL ||
				id_tipo_pago_anticipado === TipoPagoAnticipado.PORCENTAJE) &&
			fecha_expiracion_autorizacion_mp !== null &&
			fecha_expiracion_autorizacion_mp < fecha_actual
		) {
			throw new HttpException(
				{
					message:
						'Primero debe autorizar que vendamos en su nombre en Mercado Pago',
					statusCode: HttpStatus.BAD_REQUEST,
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
