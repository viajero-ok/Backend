import {
	Body,
	Controller,
	Delete,
	Param,
	Post,
	Req,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { multerHabitacionConfig } from '../../utils/multer-habitacion.config';
import { ImagenesTipoDetalleService } from './imagenes-tipo-detalle.service';
import { RegistrarImagenTipoDetalleDto } from './dto/registrar-imagen-tipo-detalle.dto';

@ApiTags('Alojamientos/Imágenes Tipo Detalle')
@Controller('alojamientos/alojamiento-con-tipologias/imagenes-tipo-detalle')
export class ImagenesTipoDetalleController {
	constructor(private readonly imagenesService: ImagenesTipoDetalleService) {}

	@ApiOperation({ summary: 'REGISTRAR IMAGEN TIPO DETALLE' })
	@ApiResponse({
		status: 201,
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'number',
					example: 201,
				},
				id_imagen: {
					type: 'number',
					example: 1,
				},
			},
		},
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				imagen: {
					type: 'string',
					format: 'binary',
					description: 'Archivo de imagen del tipo detalle',
				},
				id_tipo_detalle: {
					type: 'string',
					description: 'ID del tipo detalle (habitación o vivienda)',
				},
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@Post('registrar-imagen')
	@UseInterceptors(FileInterceptor('imagen', multerHabitacionConfig))
	async registrarImagen(
		@Req() req: Request,
		@UploadedFile() imagen: Express.Multer.File,
		@Body() registrarImagenDto: RegistrarImagenTipoDetalleDto,
	) {
		return await this.imagenesService.registrarImagen(
			req,
			imagen,
			registrarImagenDto.id_tipo_detalle,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR IMAGEN TIPO DETALLE' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'number',
					example: 200,
				},
			},
		},
	})
	@Delete('eliminar-imagen/:id_imagen')
	async eliminarImagen(
		@Req() req: Request,
		@Param('id_imagen') id_imagen: string,
	) {
		return await this.imagenesService.eliminarImagen(req, id_imagen);
	}
}
