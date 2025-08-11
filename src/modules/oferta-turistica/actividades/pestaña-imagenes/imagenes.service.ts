import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { ImagenesRepositoryService } from './imagenes-repository.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ImagenesService {
	constructor(
		private readonly imagenRepositoryService: ImagenesRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

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
					id_imagen: imagenCorrespondiente.id_imagen,
					nombre: imagenCorrespondiente.nombre_original,
					datos: datos.toString('base64'),
				};
			}
			return null;
		});

		const imagenes = await Promise.all(imagenesPromesas);
		return imagenes.filter((imagen) => imagen !== null);
	}

	async obtenerImagenes(id_oferta: string) {
		const imagenes =
			await this.imagenRepositoryService.obtenerImagenes(id_oferta);

		this.exceptionHandlingService.handleError(
			imagenes,
			'Error al obtener las imágenes de la actividad',
			HttpStatus.CONFLICT,
		);

		const result = await this.obtenerImagenesOferta(imagenes);

		return result;
	}
}
