import { HttpStatus, Injectable } from '@nestjs/common';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';
import { AlojamientoDto } from './dto/alojamiento/alojamiento.dto';
import { eliminarArchivo } from '../utils/eliminar-archivo';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { ImagenProcesadaDto } from './dto/imagen-procesada.dto';
import { AlojamientoVacioDto } from './dto/alojamiento/alojamiento-vacio.dto';
import { HabitacionDto } from './dto/habitacion/habitacion.dto';
import { HabitacionVaciaDto } from './dto/habitacion/habitacion-vacia.dto';
import { DetalleAlojamientoDto } from './dto/detalle-alojamiento.dto';
import { TarifasValidator } from '../utils/tarifas.validator';
import { TarifasDto } from './dto/tarifa/tarifa.dto';

@Injectable()
export class AlojamientosService {
	constructor(
		private readonly alojamientosRepositoryService: AlojamientosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
		private readonly tarifasValidator: TarifasValidator,
	) {}

	async registrarImagenAlojamiento(
		req,
		file: Express.Multer.File,
		id_oferta: string,
	) {
		try {
			const imagenProcesada = new ImagenProcesadaDto();
			imagenProcesada.nombre_original = file.originalname;
			imagenProcesada.nombre_unico = file.filename;
			imagenProcesada.ruta = file.path;
			imagenProcesada.mime_type = file.mimetype;
			imagenProcesada.tamaño = file.size;

			const result =
				await this.alojamientosRepositoryService.registrarImagenAlojamiento(
					id_oferta,
					req.user.id_usuario,
					imagenProcesada,
				);

			this.exceptionHandlingService.handleError(
				result,
				'Error al registrar imagen del alojamiento',
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

	async eliminarImagenAlojamiento(req, id_imagen: string) {
		const result =
			await this.alojamientosRepositoryService.eliminarImagenAlojamiento(
				req.user.id_usuario,
				id_imagen,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar imagen del alojamiento',
			HttpStatus.CONFLICT,
		);

		await eliminarArchivo(result.ruta_archivo);

		return { resultado: 'ok', statusCode: 200 };
	}

	async registrarAlojamiento(req, alojamientoDto: AlojamientoDto) {
		try {
			const resultados =
				await this.alojamientosRepositoryService.registrarAlojamiento(
					req.user.id_usuario,
					alojamientoDto,
				);
			// Verificar resultados individuales
			this.exceptionHandlingService.handleError(
				resultados.alojamiento,
				'Error al registrar alojamiento',
				HttpStatus.CONFLICT,
			);
			this.exceptionHandlingService.handleError(
				resultados.caracteristicas,
				'Error al registrar características del alojamiento',
				HttpStatus.CONFLICT,
			);
			this.exceptionHandlingService.handleError(
				resultados.metodos_pago,
				'Error al registrar métodos de pago del alojamiento',
				HttpStatus.CONFLICT,
			);

			resultados.observaciones.forEach((observacion, index) => {
				this.exceptionHandlingService.handleError(
					observacion,
					`Error al registrar observación ${index + 1}`,
					HttpStatus.CONFLICT,
				);
			});

			resultados.horarios.forEach((horario, index) => {
				this.exceptionHandlingService.handleError(
					horario,
					`Error al registrar horario ${index + 1}`,
					HttpStatus.CONFLICT,
				);
			});

			return {
				resultado: 'ok',
				statusCode: 201,
				id_oferta: resultados.alojamiento.id_oferta,
			};
		} catch (error) {
			throw error;
		}
	}

	async obtenerDatosRegistroAlojamiento() {
		return await this.alojamientosRepositoryService.obtenerDatosRegistroAlojamiento();
	}

	async registrarAlojamientoVacio(
		req,
		alojamientoVacioDto: AlojamientoVacioDto,
	) {
		const result =
			await this.alojamientosRepositoryService.registrarAlojamientoVacio(
				req.user.id_usuario,
				alojamientoVacioDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar alojamiento vacío',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_oferta: result.id_oferta,
		};
	}

	async eliminarAlojamiento(req, id_oferta: string) {
		const result =
			await this.alojamientosRepositoryService.eliminarAlojamiento(
				req.user.id_usuario,
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar alojamiento',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 200,
		};
	}

	async obtenerDatosRegistroHabitacion() {
		return await this.alojamientosRepositoryService.obtenerDatosRegistroHabitacion();
	}

	async registrarHabitacion(req, habitacionDto: HabitacionDto) {
		const resultados =
			await this.alojamientosRepositoryService.registrarHabitacion(
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

	async registrarHabitacionVacia(
		req,
		habitacionVaciaDto: HabitacionVaciaDto,
	) {
		const result =
			await this.alojamientosRepositoryService.registrarHabitacionVacia(
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

	async obtenerDatosRegistroTarifa() {
		return await this.alojamientosRepositoryService.obtenerDatosRegistroTarifa();
	}

	async registrarTarifa(req, tarifaDto: TarifasDto) {
		const tarifasExistentes =
			await this.alojamientosRepositoryService.obtenerTarifas(
				tarifaDto.id_tipo_detalle,
			);
		console.log(tarifasExistentes);

		const errores = await this.tarifasValidator.validarTarifa(
			tarifaDto,
			tarifasExistentes,
		);
		console.log(errores);
		if (errores.length > 0) {
			throw new Error(errores.join(', '));
		}

		/* const result = await this.alojamientosRepositoryService.registrarTarifa(
			req.user.id_usuario,
			tarifaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar tarifa',
			HttpStatus.CONFLICT,
		); */

		return {
			resultado: 'ok',
			statusCode: 201,
			//id_tarifa: result.id_tarifa,
		};
	}

	async finalizarRegistroAlojamiento(
		req,
		detalleAlojamientoDto: DetalleAlojamientoDto,
	) {
		const result =
			await this.alojamientosRepositoryService.finalizarRegistroAlojamiento(
				req.user.id_usuario,
				detalleAlojamientoDto,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al finalizar el registro del alojamiento',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}
}
