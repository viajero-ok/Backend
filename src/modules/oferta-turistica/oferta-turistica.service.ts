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
import { ConsultarOfertaDto } from './dto/consultar-oferta.dto';
import { ConsultarResumenOfertaDto } from './dto/consultar-resumen-oferta.dto';
import { EliminarOfertaDto } from './dto/eliminar-oferta.dto';

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

	async eliminarOfertaTuristica(req, eliminarOfertaDto: EliminarOfertaDto) {
		const result =
			await this.ofertaTuristicaRepositoryService.eliminarOfertaTuristica(
				req.user.id_usuario,
				eliminarOfertaDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar oferta turística',
			HttpStatus.CONFLICT,
		);

		return { resultado: 'ok', statusCode: 200 };
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
		// Calcular noches de estadía
		const noches_estadia = Math.ceil(
			(consultarOfertasDto.fecha_hasta.getTime() -
				consultarOfertasDto.fecha_desde.getTime()) /
				(1000 * 60 * 60 * 24),
		);

		const result =
			await this.ofertaTuristicaRepositoryService.obtenerOfertasTuristicas(
				consultarOfertasDto,
				noches_estadia,
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
					noches_estadia: noches_estadia,
					cantidad_personas: consultarOfertasDto.cantidad_personas,
				};

				console.log(ofertaModificada);
				if (oferta.ruta_imagen) {
					try {
						const datos = await fs.readFile(
							oferta.ruta_imagen.replace(/\\/g, '/'),
						);
						return {
							...ofertaModificada,
							ruta_imagen: datos.toString('base64'),
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

	async obtenerOfertaTuristica(req, consultarOfertaDto: ConsultarOfertaDto) {
		consultarOfertaDto.fecha_desde = new Date(
			consultarOfertaDto.fecha_desde,
		);
		consultarOfertaDto.fecha_hasta = new Date(
			consultarOfertaDto.fecha_hasta,
		);
		consultarOfertaDto.fecha_desde.setHours(0, 0, 0, 0);
		consultarOfertaDto.fecha_hasta.setHours(0, 0, 0, 0);
		// Calcular noches de estadía
		const noches_estadia = Math.ceil(
			(consultarOfertaDto.fecha_hasta.getTime() -
				consultarOfertaDto.fecha_desde.getTime()) /
				(1000 * 60 * 60 * 24),
		);

		const resultado =
			await this.ofertaTuristicaRepositoryService.obtenerOfertaTuristica(
				consultarOfertaDto,
				noches_estadia,
			);

		resultado.datos_basicos.noches_estadia = noches_estadia;

		// Agregar verificación de null/undefined
		if (!resultado?.imagenes_oferta) {
			resultado.imagenes_oferta = [];
		}

		// Ahora es seguro verificar length
		if (resultado.imagenes_oferta && resultado.imagenes_oferta.length > 0) {
			resultado.imagenes_oferta = await Promise.all(
				resultado.imagenes_oferta.map(async (imagen) => {
					if (imagen.ruta_imagen) {
						try {
							const datos = await fs.readFile(
								imagen.ruta_imagen.replace(/\\/g, '/'),
							);
							return {
								...imagen,
								imagen: datos.toString('base64'),
							};
						} catch (error) {
							return imagen;
						}
					}
					return imagen;
				}),
			);
		}

		resultado.domicilio.sin_numero =
			resultado.domicilio.sin_numero === 1 ? true : false;

		console.log('RESULTADO', resultado);
		// Agrupar los detalles por tipo
		let detallesAgrupados = [];
		if (resultado.tipos_detalles.length > 0) {
			detallesAgrupados = await Promise.all(
				resultado.tipos_detalles.map(async (tipoDetalle) => {
					const detalle = {
						...tipoDetalle,
						camas_cantidad: [],
						caracteristicas: [],
						imagenes: [],
						tarifas: [],
						precio_total: 0,
					};

					if (resultado.plazas_x_tipo_detalle.length > 0) {
						detalle.camas_cantidad =
							resultado.plazas_x_tipo_detalle.filter(
								(plaza) =>
									plaza.id_tipo_detalle ===
									tipoDetalle.id_tipo_detalle,
							);
					}

					if (resultado.caracteristicas_x_tipo_detalle.length > 0) {
						detalle.caracteristicas =
							resultado.caracteristicas_x_tipo_detalle.filter(
								(caract) =>
									caract.id_tipo_detalle ===
									tipoDetalle.id_tipo_detalle,
							);
					}

					if (resultado.imagenes_x_tipo_detalle.length > 0) {
						const imagenesFiltradas =
							resultado.imagenes_x_tipo_detalle.filter(
								(imagen) =>
									imagen.id_tipo_detalle ===
									tipoDetalle.id_tipo_detalle,
							);

						detalle.imagenes = await Promise.all(
							imagenesFiltradas.map(async (imagen) => {
								if (imagen.ruta_imagen) {
									try {
										const datos = await fs.readFile(
											imagen.ruta_imagen.replace(
												/\\/g,
												'/',
											),
										);
										return {
											...imagen,
											imagen: datos.toString('base64'),
										};
									} catch (error) {
										return imagen;
									}
								}
								return imagen;
							}),
						);
					}

					if (resultado.tarifas_x_tipo_detalle.length > 0) {
						detalle.tarifas =
							resultado.tarifas_x_tipo_detalle.filter(
								(tarifa) =>
									tarifa.id_tipo_detalle ===
									tipoDetalle.id_tipo_detalle,
							);

						const fechaDesde = consultarOfertaDto.fecha_desde;
						const fechaHasta = consultarOfertaDto.fecha_hasta;

						detalle.precio_total = detalle.tarifas.reduce(
							(total, tarifa) => {
								const tarifaDesde = new Date(
									tarifa.fecha_desde,
								);
								const tarifaHasta = new Date(
									tarifa.fecha_hasta,
								);

								if (
									fechaDesde <= tarifaHasta &&
									fechaHasta >= tarifaDesde
								) {
									if (
										resultado.datos_basicos
											.id_tipo_oferta === 1
									) {
										return (
											total +
											parseFloat(tarifa.monto_tarifa) *
												noches_estadia
										);
									} else {
										return (
											total +
											parseFloat(tarifa.monto_tarifa) *
												consultarOfertaDto.cantidad_personas
										);
									}
								}
								return total;
							},
							0,
						);
					}

					return detalle;
				}),
			);
		}

		return {
			...resultado,
			imagenes_oferta: resultado.imagenes_oferta,
			tipos_detalles: detallesAgrupados,
			plazas_x_tipo_detalle: undefined,
			caracteristicas_x_tipo_detalle: undefined,
			imagenes_x_tipo_detalle: undefined,
			tarifas_x_tipo_detalle: undefined,
		};
	}

	async obtenerResumenOfertaTuristica(
		consultarResumenOfertaDto: ConsultarResumenOfertaDto,
	) {
		const result =
			await this.ofertaTuristicaRepositoryService.obtenerResumenOfertaTuristica(
				consultarResumenOfertaDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener resumen de la oferta turística',
			HttpStatus.CONFLICT,
		);

		// Calcular noches de estadía
		const noches_estadia = Math.ceil(
			(consultarResumenOfertaDto.fecha_hasta.getTime() -
				consultarResumenOfertaDto.fecha_desde.getTime()) /
				(1000 * 60 * 60 * 24),
		);

		// Calcular precio total
		let precio_total = 0;
		result.tarifas.forEach((tarifa) => {
			const tarifaDesde = new Date(tarifa.fecha_desde);
			const tarifaHasta = new Date(tarifa.fecha_hasta);

			if (
				consultarResumenOfertaDto.fecha_desde <= tarifaHasta &&
				consultarResumenOfertaDto.fecha_hasta >= tarifaDesde
			) {
				if (result.datos_basicos_oferta.id_tipo_oferta === 1) {
					// Para alojamientos, multiplicar por noches
					precio_total +=
						parseFloat(tarifa.monto_tarifa) * noches_estadia;
				} else {
					// Para otros tipos, multiplicar por cantidad de personas
					precio_total +=
						parseFloat(tarifa.monto_tarifa) *
						consultarResumenOfertaDto.cantidad_personas;
				}
			}
		});

		// Calcular pago anticipado
		const pago_anticipado =
			precio_total *
			(parseFloat(
				result.datos_basicos_oferta.porcentaje_pago_anticipado,
			) /
				100);

		return {
			...result,
			resumen_pago: {
				precio_total,
				pago_anticipado,
				noches_estadia,
				cantidad_personas: consultarResumenOfertaDto.cantidad_personas,
			},
		};
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
