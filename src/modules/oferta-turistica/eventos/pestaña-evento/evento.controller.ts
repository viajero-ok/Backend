import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventoService } from './evento.service';

@ApiTags('Eventos/Evento')
@ApiBearerAuth()
@Controller('evento')
export class EventoController {
	constructor(private readonly eventoService: EventoService) {}

	@Get('categorias-eventos')
	async obtenerCategoriasEventos() {
		return await this.eventoService.obtenerCategoriasEvento();
	}

	// @Post('datos-basicos')
	// @UseGuards(OfertaOwnerGuard)
	// async guardarDatosBasicos(
	// 	@Req() req: Request,
	// 	@Body() datosBasicosDto: GuardarDatosBasicosEventoDto,
	// ) {
	// 	return await this.eventoService.guardarDatosBasicos(
	// 		req,
	// 		datosBasicosDto,
	// 	);
	// }
}
