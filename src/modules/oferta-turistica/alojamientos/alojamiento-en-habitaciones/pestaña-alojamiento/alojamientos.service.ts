import { HttpStatus, Injectable } from '@nestjs/common';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { DetalleAlojamientoDto } from '../dto/detalle-alojamiento.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AlojamientosService {
	constructor(
		private readonly alojamientosRepositoryService: AlojamientosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async actualizarAlojamiento(req, alojamientoDto: AlojamientoDto) {
		try {
			const resultados =
				await this.alojamientosRepositoryService.actualizarAlojamiento(
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

	async obtenerDatosRegistrados(req, id_oferta: string) {
		const result =
			await this.alojamientosRepositoryService.obtenerDatosRegistrados(
				id_oferta,
			);

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener datos registrados',
			HttpStatus.CONFLICT,
		);

		const datosImagenes =
			await this.alojamientosRepositoryService.obtenerImagenes(id_oferta);
		const imagenes = await this.obtenerImagenesOferta(datosImagenes);

		return {
			datos: result,
			imagenes,
		};
	}

	async obtenerImagenesOferta(
		datosImagenes: any[],
	): Promise<{ nombre: string; datos: string }[]> {
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
					nombre: imagenCorrespondiente.nombre_original,
					datos: datos.toString('base64'),
				};
			}
			return null;
		});

		const imagenes = await Promise.all(imagenesPromesas);
		return imagenes.filter((imagen) => imagen !== null);
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
