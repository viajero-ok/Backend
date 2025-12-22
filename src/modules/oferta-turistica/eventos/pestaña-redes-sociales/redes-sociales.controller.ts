import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { EliminarRedSocialDto, NuevaRedSocialDto } from './dto/RedSocial.dto';
import { RedesSocialesService } from './redes-sociales.service';

@ApiTags('Eventos/RedesSociales')
@ApiBearerAuth()
@Controller('redes-sociales')
export class RedesSocialesController {
	constructor(private readonly redesSocialesService: RedesSocialesService) {}

	@Post('nueva')
	@UseGuards(OfertaOwnerGuard)
	async registrarRedSocial(@Body() nuevaRedSocialDto: NuevaRedSocialDto) {
		return await this.redesSocialesService.registrarRedSocial(
			nuevaRedSocialDto,
		);
	}

	@Delete('eliminar')
	@UseGuards(OfertaOwnerGuard)
	async eliminarRedSocial(
		@Body() eliminarRedSocialDto: EliminarRedSocialDto,
	) {
		return await this.redesSocialesService.eliminarRedSocial(
			eliminarRedSocialDto,
		);
	}

	@Get('datos-registro')
	async obtenerRedesSociales() {
		return await this.redesSocialesService.obtenerRedesSociales();
	}

	// @Get('categorias-eventos')
	// async obtenerCategoriasEventos() {
	// 	return await this.redesSocialesService.obtenerCategoriasEvento();
	// }

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

	// @Get(`obtener-datos-registrados/:id_oferta`)
	// @UseGuards(OfertaOwnerGuard)
	// async obtenerDatosRegistrados(
	// 	@Req() req: Request,
	// 	@Param('id_oferta') id_oferta: string,
	// ) {
	// 	return await this.eventoService.obtenerDatosRegistrados(id_oferta);
	// }
}
