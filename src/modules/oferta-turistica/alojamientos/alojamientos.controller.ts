import {
	Body,
	Controller,
	Post,
	Req,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multer.config';

@ApiTags('Alojamientos')
@ApiBearerAuth()
@Controller('alojamientos')
export class AlojamientosController {
	constructor(private readonly alojamientosService: AlojamientosService) {}

	@ApiOperation({ summary: 'REGISTRAR ALOJAMIENTO' })
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
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@Post('registrar-alojamiento')
	@UseInterceptors(
		FileFieldsInterceptor(
			[{ name: 'habitaciones', maxCount: 100 }],
			multerConfig,
		),
	)
	async registrarAlojamiento(
		@Req() req: Request,
		@Body('alojamiento') alojamientoJson: AlojamientoDto,
		@UploadedFiles() files: { [fieldname: string]: Express.Multer.File[] },
	) {
		console.log(alojamientoJson);
		return await this.alojamientosService.registrarAlojamiento(
			req,
			alojamientoJson,
			files,
		);
	}
}
