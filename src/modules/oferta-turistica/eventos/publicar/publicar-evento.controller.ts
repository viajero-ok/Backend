import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { PublicarEventoService } from './publicar-evento.service';

@ApiTags('Eventos/Publicar')
@ApiBearerAuth()
@Controller('evento/publicar')
export class PublicarEventoController {
	constructor(
		private readonly publicarEventoService: PublicarEventoService,
	) {}

	@Post('publicar-evento')
	@UseGuards(OfertaOwnerGuard)
	async registrarEntrada(@Req() req, @Body() body: { id_oferta: string }) {
		return await this.publicarEventoService.publicarEvento(
			req.user.id_usuario,
			body.id_oferta,
		);
	}
}
