import { HttpStatus, Injectable } from '@nestjs/common';
import { OfertaTuristicaRepositoryService } from './oferta-turistica-repository.service';
import { OfertaTuristicaDto } from './dto/oferta-turistica.dto';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { eliminarArchivo } from './utils/eliminar-archivo';
import { ImagenProcesadaDto } from './dto/imagen-procesada.dto';

@Injectable()
export class OfertaTuristicaService {
	constructor(
		private readonly ofertaTuristicaRepositoryService: OfertaTuristicaRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}
	async obtenerOfertasPorPrestador(req) {
		return await this.ofertaTuristicaRepositoryService.obtenerOfertasPorPrestador(
			req.user.id_usuario,
		);
	}

	async obtenerTiposSubtipos() {
		const result =
			await this.ofertaTuristicaRepositoryService.obtenerTiposSubtipos();
		return { resultado: 'ok', statusCode: 200, tipos_y_subtipos: result };
	}

	async registrarOfertaTuristica(
		req,
		ofertaTuristicaDto: OfertaTuristicaDto,
	) {
		const result =
			await this.ofertaTuristicaRepositoryService.registrarOfertaTuristica(
				req.user.id_usuario,
				ofertaTuristicaDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar oferta turística',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_oferta: result.id_oferta,
		};
	}

	async eliminarOfertaTuristica(req, id_oferta: string) {
		const result =
			await this.ofertaTuristicaRepositoryService.eliminarOfertaTuristica(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar oferta turística',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async registrarImagenOfertaTuristica(
		req,
		file: Express.Multer.File,
		id_oferta: string,
	) {
		try {
			console.log(file);
			const imagenProcesada = new ImagenProcesadaDto();
			imagenProcesada.nombre_original = file.originalname;
			imagenProcesada.nombre_unico = file.filename;
			imagenProcesada.ruta = file.path;
			imagenProcesada.mime_type = file.mimetype;
			imagenProcesada.tamaño = file.size;

			const result =
				await this.ofertaTuristicaRepositoryService.registrarImagenOfertaTuristica(
					id_oferta,
					req.user.id_usuario,
					imagenProcesada,
				);

			this.exceptionHandlingService.handleError(
				result,
				'Error al registrar imagen de la oferta turística',
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

	async eliminarImagenOfertaTuristica(req, id_imagen: string) {
		const result =
			await this.ofertaTuristicaRepositoryService.eliminarImagenOfertaTuristica(
				req.user.id_usuario,
				id_imagen,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar imagen de la oferta turística',
			HttpStatus.CONFLICT,
		);

		await eliminarArchivo(result.ruta_archivo);

		return { resultado: 'ok', statusCode: 200 };
	}
}
