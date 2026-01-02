import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { ViviendasRepositoryService } from './viviendas-repository.service';
import { ViviendaDto } from './dto/vivienda.dto';
import { RegistrarViviendaDto } from './dto/registrar-vivienda.dto';
import { ImagenesTipoDetalleService } from '../imagenes/imagenes-tipo-detalle.service';
import { ImagenesTipoDetalleRepositoryService } from '../imagenes/imagenes-tipo-detalle-repository.service';

@Injectable()
export class ViviendasService {
	constructor(
		private readonly viviendasRepositoryService: ViviendasRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
		private readonly imagenesService: ImagenesTipoDetalleService,
		private readonly imagenesRepositoryService: ImagenesTipoDetalleRepositoryService,
	) {}

	async obtenerDatosRegistroVivienda() {
		return await this.viviendasRepositoryService.obtenerDatosRegistroVivienda();
	}

	async actualizarVivienda(req, viviendaDto: ViviendaDto) {
		const resultados =
			await this.viviendasRepositoryService.actualizarVivienda(
				req.user.id_usuario,
				viviendaDto,
			);

		// Verificar resultados individuales
		this.exceptionHandlingService.handleError(
			resultados.tipo_detalle,
			'Error al registrar tipo de detalle',
			HttpStatus.CONFLICT,
		);
		this.exceptionHandlingService.handleError(
			resultados.caracteristicas,
			'Error al registrar características',
			HttpStatus.CONFLICT,
		);
		resultados.plazas.forEach((plaza, index) => {
			this.exceptionHandlingService.handleError(
				plaza,
				`Error al registrar plaza ${index + 1}`,
				HttpStatus.CONFLICT,
			);
		});
		resultados.observaciones.forEach((observacion, index) => {
			this.exceptionHandlingService.handleError(
				observacion,
				`Error al registrar observación ${index + 1}`,
				HttpStatus.CONFLICT,
			);
		});

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}

	async registrarVivienda(req, registrarViviendaDto: RegistrarViviendaDto) {
		const result = await this.viviendasRepositoryService.registrarVivienda(
			req.user.id_usuario,
			registrarViviendaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar vivienda vacía',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_tipo_detalle: result.id_tipo_detalle,
		};
	}

	async eliminarVivienda(req, id_tipo_detalle: string) {
		const result = await this.viviendasRepositoryService.eliminarVivienda(
			req.user.id_usuario,
			id_tipo_detalle,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar vivienda',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async obtenerDatosRegistradosVivienda(req, id_oferta: string) {
		const resultado =
			await this.viviendasRepositoryService.obtenerDatosRegistradosVivienda(
				id_oferta,
			);

		const viviendas = resultado.viviendas;
		const plazas = resultado.plazas;
		const caracteristicas = resultado.caracteristicas;

		const respuesta = viviendas.map((vivienda) => {
			return {
				...vivienda,
				plazas: plazas.filter(
					(plaza) =>
						plaza.id_tipo_detalle === vivienda.id_tipo_detalle,
				),
				caracteristicas: caracteristicas.filter(
					(carac) =>
						carac.id_tipo_detalle === vivienda.id_tipo_detalle,
				),
			};
		});

		for (const tipo_detalle of respuesta) {
			const datosImagenes =
				await this.imagenesRepositoryService.obtenerImagenes(
					tipo_detalle.id_tipo_detalle,
				);
			tipo_detalle.imagenes =
				await this.imagenesService.obtenerImagenesOferta(datosImagenes);
			tipo_detalle.bl_baño_compartido =
				tipo_detalle.bl_baño_compartido === 1 ? true : false;
			tipo_detalle.bl_baño_adaptado =
				tipo_detalle.bl_baño_adaptado === 1 ? true : false;
		}

		return {
			datos: respuesta,
		};
	}
}
