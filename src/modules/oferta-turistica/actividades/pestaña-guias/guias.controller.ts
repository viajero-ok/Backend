import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { GuiasService } from './guias.services';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';

@ApiTags('Actividades/Guias')
@ApiBearerAuth()
@Controller('actividades')
export class GuiasController {
	constructor(private readonly guiasService: GuiasService) {}

	@ApiOperation({ summary: 'OBTENER GUÍAS REGISTRADOS' })
	@ApiResponse({ status: 200 })
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-guias/:id_oferta')
	async obtenerGuias(@Param('id_oferta') id_oferta: string) {
		return await this.guiasService.obtenerGuias(id_oferta);
	}
}
