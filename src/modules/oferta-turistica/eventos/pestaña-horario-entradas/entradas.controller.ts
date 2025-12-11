import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import {
	EliminarEntradaDto,
	EntradaDto,
	ModificarEntradaDto,
} from './dto/entrada.dto';
import { EntradasService } from './entradas.service';

@ApiTags('Eventos/Entradas')
@ApiBearerAuth()
@Controller('evento/entradas')
export class EntradasController {
	constructor(private readonly entradasService: EntradasService) {}

	// @Get('categorias-eventos')
	// async obtenerCategoriasEventos() {
	//     return await this.eventoService.obtenerCategoriasEvento();
	// }
	@Get('obtener-entradas/:id_oferta')
	async obtenerEntradas(
		@Req() req: Request,
		@Param() params: { id_oferta: string },
	) {
		return await this.entradasService.obtenerEntradas(params.id_oferta);
	}

	@Delete('eliminar-entrada')
	@UseGuards(OfertaOwnerGuard)
	async eliminarEntrada(
		@Req() req: Request,
		@Query() entradaDto: EliminarEntradaDto, // Si, son params pero quedó como body
	) {
		return await this.entradasService.eliminarEntrada(entradaDto);
	}

	@Post('registrar-entrada')
	@UseGuards(OfertaOwnerGuard)
	async registrarEntrada(
		@Req() req: Request,
		@Body() entradaDto: EntradaDto,
	) {
		return await this.entradasService.registrarEntrada(entradaDto);
	}

	@Post('modificar-entrada')
	@UseGuards(OfertaOwnerGuard)
	async modificarEntrada(
		@Req() req: Request,
		@Body() entradaDto: ModificarEntradaDto,
	) {
		return await this.entradasService.modificarEntrada(entradaDto);
	}
}
