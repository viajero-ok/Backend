import {
	BadRequestException,
	Controller,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { CargarUbicacionesService } from './cargar-ubicaciones.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('cargar-ubicaciones')
export class CargarUbicacionesController {
	constructor(
		private readonly cargarUbicacionesService: CargarUbicacionesService,
	) {}

	@Post('/convertir-excel')
	@UseInterceptors(FileInterceptor('file'))
	async convertirExcel(
		@UploadedFile() file: Express.Multer.File,
		@Res() res: Response,
	) {
		if (!file) {
			throw new BadRequestException(
				'No se ha proporcionado ningún archivo',
			);
		}
		// Asegurarse de que file.buffer es un Buffer
		const fileBuffer = Buffer.isBuffer(file.buffer)
			? file.buffer
			: Buffer.from(file.buffer);

		try {
			const processedBuffer =
				await this.cargarUbicacionesService.processExcel(fileBuffer);

			res.set({
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition':
					'attachment; filename="ubicaciones_procesadas.xlsx"',
				'Content-Length': processedBuffer.length,
			});

			res.send(processedBuffer);
		} catch (error) {
			throw new BadRequestException(
				`Error al procesar el archivo: ${error.message}`,
			);
		}
	}

	@Post('/cargar')
	@UseInterceptors(FileInterceptor('file'))
	async cargarUbicaciones(
		@UploadedFile() file: Express.Multer.File,
		@Res() res: Response,
	) {
		if (!file) {
			throw new BadRequestException(
				'No se ha proporcionado ningún archivo',
			);
		}
		// Asegurarse de que file.buffer es un Buffer
		const fileBuffer = Buffer.isBuffer(file.buffer)
			? file.buffer
			: Buffer.from(file.buffer);

		try {
			const noActualizadasBuffer =
				await this.cargarUbicacionesService.cargarDatosDesdeExcel(
					fileBuffer,
				);

			if (noActualizadasBuffer) {
				res.set({
					'Content-Type':
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'Content-Disposition':
						'attachment; filename="ubicaciones_no_actualizadas.xlsx"',
					'Content-Length': noActualizadasBuffer.length,
				});
				res.send(noActualizadasBuffer);
			} else {
				res.json({
					message:
						'Todas las ubicaciones fueron actualizadas correctamente.',
				});
			}
		} catch (error) {
			throw new BadRequestException(
				`Error al procesar el archivo: ${error.message}`,
			);
		}
	}
}
