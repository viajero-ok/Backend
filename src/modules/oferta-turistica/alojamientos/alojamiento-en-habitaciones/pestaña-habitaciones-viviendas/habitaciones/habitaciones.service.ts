import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { HabitacionesRepositoryService } from './habitaciones-repository.service';
import { HabitacionDto } from './dto/habitacion.dto';
import { RegistrarHabitacionDto } from './dto/registrar-habitacion.dto';
import { ImagenesTipoDetalleService } from '../imagenes/imagenes-tipo-detalle.service';
import { ImagenesTipoDetalleRepositoryService } from '../imagenes/imagenes-tipo-detalle-repository.service';

@Injectable()
export class HabitacionesService {
	constructor(
		private readonly habitacionesRepositoryService: HabitacionesRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
		private readonly imagenesService: ImagenesTipoDetalleService,
		private readonly imagenesRepositoryService: ImagenesTipoDetalleRepositoryService,
	) {}

	async obtenerDatosRegistroHabitacion() {
		return await this.habitacionesRepositoryService.obtenerDatosRegistroHabitacion();
	}

	async actualizarHabitacion(req, habitacionDto: HabitacionDto) {
		const resultados =
			await this.habitacionesRepositoryService.actualizarHabitacion(
				req.user.id_usuario,
				habitacionDto,
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

	async registrarHabitacion(
		req,
		registrarHabitacionDto: RegistrarHabitacionDto,
	) {
		const result =
			await this.habitacionesRepositoryService.registrarHabitacion(
				req.user.id_usuario,
				registrarHabitacionDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar habitación vacía',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_tipo_detalle: result.id_tipo_detalle,
		};
	}

	async eliminarHabitacion(req, id_tipo_detalle: string) {
		const result =
			await this.habitacionesRepositoryService.eliminarHabitacion(
				req.user.id_usuario,
				id_tipo_detalle,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar habitación',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async obtenerDatosRegistradosHabitacion(req, id_oferta: string) {
		const resultado =
			await this.habitacionesRepositoryService.obtenerDatosRegistradosHabitacion(
				id_oferta,
			);

		const habitaciones = resultado.habitaciones;
		const plazas = resultado.plazas;
		const caracteristicas = resultado.caracteristicas;

		const respuesta = habitaciones.map((habitacion) => {
			return {
				...habitacion,
				plazas: plazas.filter(
					(plaza) =>
						plaza.id_tipo_detalle === habitacion.id_tipo_detalle,
				),
				caracteristicas: caracteristicas.filter(
					(carac) =>
						carac.id_tipo_detalle === habitacion.id_tipo_detalle,
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
