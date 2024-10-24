import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { ImagenProcesadaDto } from '../dto/imagen-procesada.dto';
import { eliminarArchivo } from 'src/modules/oferta-turistica/utils/eliminar-archivo';
import { HabitacionesRepositoryService } from './habitaciones-repository.service';
import { HabitacionDto } from './dto/habitacion.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { RegistrarHabitacionDto } from './dto/registrar-habitacion.dto';
import { RegistrarImagenHabitacionDto } from './dto/registrar-imagen-habitacion.dto';

@Injectable()
export class HabitacionesService {
	constructor(
		private readonly habitacionesRepositoryService: HabitacionesRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarImagenHabitacion(
		req,
		file: Express.Multer.File,
		registrarImagenHabitacionDto: RegistrarImagenHabitacionDto,
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
					registrarImagenHabitacionDto,
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
				await this.habitacionesRepositoryService.obtenerImagenes(
					tipo_detalle.id_tipo_detalle,
				);
			tipo_detalle.imagenes =
				await this.obtenerImagenesOferta(datosImagenes);
			tipo_detalle.bl_baño_compartido =
				tipo_detalle.bl_baño_compartido === 1 ? true : false;
			tipo_detalle.bl_baño_adaptado =
				tipo_detalle.bl_baño_adaptado === 1 ? true : false;
		}

		return {
			datos: respuesta,
		};
	}

	async obtenerImagenesOferta(
		datosImagenes: any[],
	): Promise<{ id_imagen: number; nombre: string; datos: string }[]> {
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
}
