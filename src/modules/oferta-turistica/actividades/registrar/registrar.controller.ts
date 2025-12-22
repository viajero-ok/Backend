import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { RegistrarService } from './registrar.service';

@ApiTags('Actividades/Registrar')
@ApiBearerAuth()
@Controller('actividades')
export class RegistrarController {
	constructor(private readonly registrarService: RegistrarService) {}

	@ApiOperation({ summary: 'Registrar actividad' })
	@ApiResponse({
		status: 200,
	})
	@UseGuards(OfertaOwnerGuard)
	@Post('registrar-actividad/:id_oferta')
	async registrarHorario(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.registrarService.registrarActividad(req, id_oferta);
	}
}
