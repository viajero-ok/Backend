import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { ImagenProcesadaDto } from '../../dto/imagen-procesada.dto';
import { eliminarArchivo } from 'src/modules/oferta-turistica/utils/eliminar-archivo';
import { ImagenesTipoDetalleRepositoryService } from './imagenes-tipo-detalle-repository.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ImagenesTipoDetalleService {
	constructor(
		private readonly imagenesRepositoryService: ImagenesTipoDetalleRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async registrarImagen(
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

			const result = await this.imagenesRepositoryService.registrarImagen(
				id_tipo_detalle,
				req.user.id_usuario,
				imagenProcesada,
			);

			this.exceptionHandlingService.handleError(
				result,
				'Error al registrar imagen',
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

	async eliminarImagen(req, id_imagen: string) {
		const result = await this.imagenesRepositoryService.eliminarImagen(
			req.user.id_usuario,
			id_imagen,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar imagen',
			HttpStatus.CONFLICT,
		);

		await eliminarArchivo(result.ruta_archivo);

		return { resultado: 'ok', statusCode: 200 };
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
