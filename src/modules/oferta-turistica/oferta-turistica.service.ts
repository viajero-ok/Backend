import { HttpStatus, Injectable } from '@nestjs/common';
import { OfertaTuristicaRepositoryService } from './oferta-turistica-repository.service';
import { OfertaTuristicaDto } from './dto/oferta-turistica.dto';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { eliminarArchivo } from './utils/eliminar-archivo';
import { ImagenProcesadaDto } from './dto/imagenes/imagen-procesada.dto';
import { ConsultarOfertasDto } from './dto/consultar-ofertas.dto';
import { RegistrarImagenOfertaDto } from './dto/imagenes/registrar-imagen-oferta.dto';
import { RegistrarOfertaGuardadaDto } from './dto/guardadas/registrar-oferta-guardada.dto';
import * as fs from 'fs/promises';

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

	async registrarImagenOfertaTuristica(
		req,
		file: Express.Multer.File,
		registrarImagenOfertaDto: RegistrarImagenOfertaDto,
	) {
		try {
			const imagenProcesada = new ImagenProcesadaDto();
			imagenProcesada.nombre_original = file.originalname;
			imagenProcesada.nombre_unico = file.filename;
			imagenProcesada.ruta = file.path;
			imagenProcesada.mime_type = file.mimetype;
			imagenProcesada.tamaño = file.size;

			const result =
				await this.ofertaTuristicaRepositoryService.registrarImagenOfertaTuristica(
					registrarImagenOfertaDto,
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

	async obtenerOfertasTuristicas(
		req,
		consultarOfertasDto: ConsultarOfertasDto,
	) {
		const result =
			await this.ofertaTuristicaRepositoryService.obtenerOfertasTuristicas(
				consultarOfertasDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener ofertas turísticas',
			HttpStatus.CONFLICT,
		);

		const ofertasConImagenes = await Promise.all(
			result.map(async (oferta) => {
				const camas_array = oferta.camas_cantidad
					.split(',')
					.map((item) => {
						const [nombre_cama, cantidad] = item.trim().split(':');
						return {
							nombre_cama: nombre_cama.trim(),
							cantidad: parseInt(cantidad.trim()),
						};
					});

				const ofertaModificada = {
					...oferta,
					camas_cantidad: camas_array,
				};

				if (oferta.ruta_imagen) {
					try {
						const datos = await fs.readFile(oferta.ruta_imagen);
						return {
							...ofertaModificada,
							imagen: datos.toString('base64'),
						};
					} catch (error) {
						return ofertaModificada;
					}
				}
				return ofertaModificada;
			}),
		);

		return ofertasConImagenes;
	}

	async registrarOfertaTuristicaGuardada(
		req,
		registrarOfertaGuardadaDto: RegistrarOfertaGuardadaDto,
	) {
		const result =
			await this.ofertaTuristicaRepositoryService.registrarOfertaTuristicaGuardada(
				req.user.id_usuario,
				registrarOfertaGuardadaDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar oferta turística guardada',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_oferta_guardada: result.id_oferta_guardada,
		};
	}

	async eliminarOfertaTuristicaGuardada(req, id_oferta_guardada: string) {
		const result =
			await this.ofertaTuristicaRepositoryService.eliminarOfertaTuristicaGuardada(
				id_oferta_guardada,
				req.user.id_usuario,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar oferta turística guardada',
			HttpStatus.CONFLICT,
		);

		return { resultado: 'ok', statusCode: 200 };
	}

	async obtenerOfertasGuardadasPorUsuario(req) {
		const result =
			await this.ofertaTuristicaRepositoryService.obtenerOfertasGuardadasPorUsuario(
				req.user.id_usuario,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener ofertas guardadas por usuario',
			HttpStatus.CONFLICT,
		);

		return { resultado: 'ok', statusCode: 200, ofertas_guardadas: result };
	}
}
