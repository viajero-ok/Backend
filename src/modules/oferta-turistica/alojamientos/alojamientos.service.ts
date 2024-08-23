import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';
import { AlojamientoDto } from './dto/alojamiento.dto';
import * as path from 'path';
import { eliminarArchivos } from '../utils/eliminar-archivos';

@Injectable()
export class AlojamientosService {
	constructor(
		private readonly alojamientosRepositoryService: AlojamientosRepositoryService,
	) {}

	async registrarAlojamiento(
		req,
		alojamientoDto: AlojamientoDto,
		files: { [fieldname: string]: Express.Multer.File[] },
	) {
		const rutasImagenesSubidas: string[] = [];
		try {
			const habitacionesConImagenes = this.procesarImagenes(
				alojamientoDto,
				files,
				rutasImagenesSubidas,
			);

			const alojamientoConImagenes: AlojamientoDto = {
				...alojamientoDto,
				habitaciones: {
					habitaciones: habitacionesConImagenes,
				},
			};

			/* const result =
				await this.alojamientosRepositoryService.registrarAlojamiento(
					req.user.id_usuario,
					alojamientoConImagenes,
				);

			if (result.resultado === 'error') {
				throw new HttpException(
					'Error al registrar alojamiento.',
					HttpStatus.CONFLICT,
				);
			} */
			return { resultado: 'ok', statusCode: 201 };
		} catch (error) {
			eliminarArchivos(rutasImagenesSubidas);
			throw error;
		} finally {
			// Almacenar todas las rutas de imágenes
			const todasLasImagenes: string[] = [];
			Object.values(files)
				.flat()
				.forEach((file) => {
					const filePath = `uploads/${file.filename}`;
					todasLasImagenes.push(filePath);
				});
			// Identificar y eliminar las imágenes que no se usaron
			const imagenesNoUsadas = todasLasImagenes.filter(
				(imagen) => !rutasImagenesSubidas.includes(imagen),
			);
			if (imagenesNoUsadas.length > 0) {
				await eliminarArchivos(imagenesNoUsadas);
			}
		}
	}

	private procesarImagenes(
		alojamientoDto: AlojamientoDto,
		files: { [fieldname: string]: Express.Multer.File[] },
		rutasImagenesSubidas: string[],
	) {
		return alojamientoDto.habitaciones.habitaciones.map(
			(habitacion, index) => {
				const campoImagen = `habitacion${index + 1}`;
				const imagenes = files[campoImagen] || [];
				const imagenesProcesadas = imagenes.map((file) => {
					const uniqueFilename = `${path.basename(file.filename, path.extname(file.filename))}${path.extname(file.originalname)}`;
					const filePath = `uploads/${uniqueFilename}`;

					// Agrega la ruta al arreglo para ser eliminada en caso de error
					rutasImagenesSubidas.push(filePath);

					return {
						nombre_original: file.originalname,
						nombre_unico: uniqueFilename,
						ruta: filePath,
						mime_type: file.mimetype,
						tamaño: file.size,
					};
				});

				return {
					...habitacion,
					contenido_multimedia: {
						...habitacion.contenido_multimedia,
						imagenes: imagenesProcesadas,
					},
				};
			},
		);
	}
}
