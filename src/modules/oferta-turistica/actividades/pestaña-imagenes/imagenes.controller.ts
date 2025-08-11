import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { ImagenesService } from './imagenes.service';

@ApiTags('Actividades/Imagenes')
@ApiBearerAuth()
@Controller('actividades')
export class ImagenesController {
	constructor(private readonly imagenesService: ImagenesService) {}

	@ApiOperation({ summary: 'Obtener imagenes registradas de la actividad' })
	@ApiResponse({ status: 200 })
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-imagenes/:id_oferta')
	async obtenerImagenes(@Param('id_oferta') id_oferta: string) {
		return await this.imagenesService.obtenerImagenes(id_oferta);
	}
}
