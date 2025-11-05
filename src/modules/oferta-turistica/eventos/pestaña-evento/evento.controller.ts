import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventoService } from './evento.service';
import { GuardarDatosBasicosEventoDto } from './dto/datos-basicos.dto';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';

@ApiTags('Eventos/Evento')
@ApiBearerAuth()
@Controller('evento')
export class EventoController {
	constructor(private readonly eventoService: EventoService) {}

	@Get('categorias-eventos')
	async obtenerCategoriasEventos() {
		return await this.eventoService.obtenerCategoriasEvento();
	}

	@Post('datos-basicos')
	@UseGuards(OfertaOwnerGuard)
	async guardarDatosBasicos(
		@Req() req: Request,
		@Body() datosBasicosDto: GuardarDatosBasicosEventoDto,
	) {
		return await this.eventoService.guardarDatosBasicos(
			req,
			datosBasicosDto,
		);
	}

	@Get(`obtener-datos-registrados/:id_oferta`)
	@UseGuards(OfertaOwnerGuard)
	async obtenerDatosRegistrados(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.eventoService.obtenerDatosRegistrados(id_oferta);
	}
}
