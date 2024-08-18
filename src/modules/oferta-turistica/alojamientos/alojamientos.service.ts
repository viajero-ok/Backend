import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class AlojamientosService {
	constructor(
		private readonly alojamientosRepositoryService: AlojamientosRepositoryService,
	) {}

	async registrarAlojamiento(
		req,
		alojamientoDto,
		files: { [fieldname: string]: Express.Multer.File[] },
	) {
		const habitacionesConImagenes = this.procesarImagenes(
			alojamientoDto,
			files,
		);
		console.log(
			'*********************HABITACIONES CON IMAGENES*********************',
		);
		console.log(habitacionesConImagenes);

		const alojamientoConImagenes: AlojamientoDto = {
			...alojamientoDto,
			habitaciones: {
				habitaciones: habitacionesConImagenes,
			},
		};
		console.log(
			'*********************ALOJAMIENTO CON IMAGENES*********************',
		);
		console.log(alojamientoConImagenes);
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
	}

	private procesarImagenes(
		alojamientoDto: AlojamientoDto,
		files: { [fieldname: string]: Express.Multer.File[] },
	) {
		return alojamientoDto.habitaciones.habitaciones.map(
			(habitacion, index) => {
				const imagenesKey = `habitaciones[${index}].contenido_multimedia.imagenes`;
				const imagenes = files[imagenesKey] || [];

				const imagenesProcessadas = imagenes.map((file) => {
					const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
					const filePath = `uploads/${uniqueFilename}`;

					// Aquí deberías mover el archivo a la ubicación final
					// Por ejemplo: fs.renameSync(file.path, filePath);

					return {
						nombreOriginal: file.originalname,
						nombreUnico: uniqueFilename,
						ruta: filePath,
						mimeType: file.mimetype,
						tamano: file.size,
					};
				});

				return {
					...habitacion,
					contenido_multimedia: {
						...habitacion.contenido_multimedia,
						imagenes: imagenesProcessadas,
					},
				};
			},
		);
	}
}
