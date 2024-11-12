import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ActividadRepositoryService } from './actividad-repository.service';
import { ActividadDto } from './dto/actividad.dto';
import { EliminarGuiaDto } from './dto/eliminar-guia.dto';
import { RegistrarGuiaDto } from './dto/registrar-guia.dto';
import { ModificarGuiaDto } from './dto/modificar-guia.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ActividadService {
	constructor(
		private readonly actividadRepositoryService: ActividadRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async obtenerDatosRegistroActividades() {
		const result =
			await this.actividadRepositoryService.obtenerDatosRegistroActividades();

		this.exceptionHandlingService.handleError(
			result,
			'Error al obtener los datos de registro de actividades',
			HttpStatus.CONFLICT,
		);

		return result;
	}

	async registrarGuia(req, guiaDto: RegistrarGuiaDto) {
		const result = await this.actividadRepositoryService.registrarGuia(
			req.user.id_usuario,
			guiaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al registrar el guia',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
			id_guia: result.id_guia,
		};
	}

	async modificarGuia(req, guiaDto: ModificarGuiaDto) {
		const result = await this.actividadRepositoryService.modificarGuia(
			req.user.id_usuario,
			guiaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al modificar el guia',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.OK,
			id_guia: result.id_guia,
		};
	}

	async eliminarGuia(req, eliminarGuiaDto: EliminarGuiaDto) {
		const result = await this.actividadRepositoryService.eliminarGuia(
			req.user.id_usuario,
			eliminarGuiaDto,
		);

		this.exceptionHandlingService.handleError(
			result,
			'Error al eliminar el guia',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.OK,
		};
	}

	async actualizarActividad(req, actividadDto: ActividadDto) {
		const result =
			await this.actividadRepositoryService.actualizarActividad(
				req.user.id_usuario,
				actividadDto,
			);

		this.exceptionHandlingService.handleError(
			result.actividad,
			'Error al registrar la actividad',
			HttpStatus.CONFLICT,
		);

		this.exceptionHandlingService.handleError(
			result.metodos_pago,
			'Error al registrar los métodos de pago',
			HttpStatus.CONFLICT,
		);

		return {
			resultado: 'ok',
			statusCode: HttpStatus.CREATED,
			id_oferta: result.actividad.id_oferta,
		};
	}

	async obtenerDatosRegistradosActividad(id_oferta: string) {
		const result =
			await this.actividadRepositoryService.obtenerDatosRegistradosActividad(
				id_oferta,
			);

		const datosImagenes =
			await this.actividadRepositoryService.obtenerImagenes(id_oferta);
		const imagenes = await this.obtenerImagenesOferta(datosImagenes);

		return {
			datos_actividad: result,
			imagenes,
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
}
