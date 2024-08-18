import { Controller, Get, Req } from '@nestjs/common';
import { OfertaTuristicaService } from './oferta-turistica.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Ofertas Turísticas')
@ApiBearerAuth()
@Controller('ofertas-turisticas')
export class OfertaTuristicaController {
	constructor(
		private readonly ofertaTuristicaService: OfertaTuristicaService,
	) {}

	@ApiOperation({ summary: 'OBTENER OFERTAS POR PRESTADOR' })
	@Get('por-prestador')
	async obtenerOfertasPorPrestador(@Req() req: Request) {
		return await this.ofertaTuristicaService.obtenerOfertasPorPrestador(
			req,
		);
	}

	@ApiOperation({ summary: 'OBTENER TIPOS Y SUBTIPOS DE OFERTAS' })
	@Get('tipos-subtipos')
	async obtenerTiposSubtipos() {
		return await this.ofertaTuristicaService.obtenerTiposSubtipos();
	}
}
