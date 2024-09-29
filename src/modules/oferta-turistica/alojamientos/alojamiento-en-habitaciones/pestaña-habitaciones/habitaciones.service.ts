import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { ImagenProcesadaDto } from '../dto/imagen-procesada.dto';
import { eliminarArchivo } from 'src/modules/oferta-turistica/utils/eliminar-archivo';
import { HabitacionesRepositoryService } from './habitaciones-repository.service';
import { HabitacionDto } from './dto/habitacion.dto';
import { HabitacionVaciaDto } from './dto/habitacion-vacia.dto';

@Injectable()
export class HabitacionesService {
	constructor(
		private readonly habitacionesRepositoryService: HabitacionesRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarImagenHabitacion(
		req,
		file: Express.Multer.File,
		id_tipo_detalle: string,
	) {
		try {
			const imagenProcesada = new ImagenProcesadaDto();
			imagenProcesada.nombre_original = file.originalname;
			imagenProcesada.nombre_unico = file.filename;
			imagenProcesada.ruta = file.path;
			imagenProcesada.mime_type = file.mimetype;
			imagenProcesada.tamaño = file.size;

			const result =
				await this.habitacionesRepositoryService.registrarImagenHabitacion(
					id_tipo_detalle,
					req.user.id_usuario,
					imagenProcesada,
				);

			this.exceptionHandlingService.handleError(
				result,
				'Error al registrar imagen de la habitación',
				HttpStatus.CONFLICT,
			);

			return {
				resultado: 'ok',
				statusCode: 201,
				id_imagen: result.id_imagen,
			};
		} catch (error) {
			await eliminarArchivo(file.path);
			throw error;
		}
	}

	async eliminarImagenHabitacion(req, id_imagen: string) {
		const result =
			await this.habitacionesRepositoryService.eliminarImagenHabitacion(
				req.user.id_usuario,
				id_imagen,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar imagen de la habitación',
			HttpStatus.CONFLICT,
		);

		await eliminarArchivo(result.ruta_archivo);

		return { resultado: 'ok', statusCode: 200 };
	}

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
			resultados.tipoDetalle,
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

	async registrarHabitacion(req, habitacionVaciaDto: HabitacionVaciaDto) {
		const result =
			await this.habitacionesRepositoryService.registrarHabitacion(
				req.user.id_usuario,
				habitacionVaciaDto,
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
}
