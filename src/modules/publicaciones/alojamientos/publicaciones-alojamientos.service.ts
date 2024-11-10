import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesAlojamientosRepositoryService } from './publicaciones-alojamientos-repository.service';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';
import { TarifasValidator } from './utils/tarifas.validator';
import { PeriodoSinTarifasValidator } from './utils/periodo-sin-tarifas.validator';
import { TipoPagoAnticipado } from '../enum/tipo_pago_anticipado.enum';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PublicacionesAlojamientosService {
	constructor(
		private readonly publicacionesAlojamientosRepositoryService: PublicacionesAlojamientosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
		private readonly tarifasValidator: TarifasValidator,
		private readonly periodoSinTarifasValidator: PeriodoSinTarifasValidator,
	) {}

	async obtenerDatosPublicacionAlojamiento(id_oferta: string) {
		const resultado =
			await this.publicacionesAlojamientosRepositoryService.obtenerDatosPublicacionAlojamiento(
				id_oferta,
			);

		return { tipos_detalles: resultado };
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
		const resultado_tarifas =
			await this.publicacionesAlojamientosRepositoryService.obtenerDatosRegistradosTarifa(
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			resultado_tarifas,
			'Error al obtener datos registrados de tarifa',
			HttpStatus.CONFLICT,
		);

		const resultado_datos_oferta =
			await this.publicacionesAlojamientosRepositoryService.obtenerDatosAlojamiento(
				id_oferta,
			);

		if (resultado_datos_oferta?.imagenes) {
			const imagenesArray = Array.isArray(resultado_datos_oferta.imagenes)
				? resultado_datos_oferta.imagenes
				: [resultado_datos_oferta.imagenes];

			const imagenes = await this.obtenerImagenesOferta(imagenesArray);
			resultado_datos_oferta.imagenes = imagenes;
		}

		return {
			datos_tarifas: resultado_tarifas,
			datos_oferta: resultado_datos_oferta,
		};
	}

	private async obtenerImagenesOferta(
		datosImagenes: any[],
	): Promise<{ id_imagen: number; nombre: string; datos: string }[]> {
		if (!datosImagenes || !Array.isArray(datosImagenes)) {
			return [];
		}

		const directorio = path.join(process.cwd(), 'uploads');
		const archivos = await fs.readdir(directorio);

		const imagenesPromesas = archivos.map(async (archivo) => {
			const rutaCompleta = path.join(directorio, archivo);
			const imagenCorrespondiente = datosImagenes.find(
				(img) => img.nombre_unico === archivo,
			);
			if (imagenCorrespondiente) {
				const datos = await fs.readFile(rutaCompleta);
				return {
					id_imagen: imagenCorrespondiente.id_imagen_x_tipo_detalle,
					nombre: imagenCorrespondiente.nombre_original,
					datos: datos.toString('base64'),
				};
			}
			return null;
		});

		const imagenes = await Promise.all(imagenesPromesas);
		return imagenes.filter((imagen) => imagen !== null);
	}

	async publicarAlojamiento(req, id_oferta: string) {
		const resultado_tipo_pago_anticipado =
			await this.publicacionesAlojamientosRepositoryService.obtenerIdTipoPagoAnticipado(
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
			await this.publicacionesAlojamientosRepositoryService.obtenerTarifas(
				id_oferta,
			);

		const tipos_entradas =
			await this.publicacionesAlojamientosRepositoryService.obtenerDatosPublicacionAlojamiento(
				id_oferta,
			);

		let errores = [];
		errores =
			await this.periodoSinTarifasValidator.validarPeriodoSinTarifas(
				tarifasExistentes,
				tipos_entradas,
			);

		const imagenes_oferta =
			await this.publicacionesAlojamientosRepositoryService.obtenerImagenesOferta(
				id_oferta,
			);

		if (imagenes_oferta.length === 0) {
			errores.push('Debe registrar al menos una imagen de la oferta');
		}

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
			await this.publicacionesAlojamientosRepositoryService.publicarAlojamiento(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al publicar alojamiento',
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
