import { Controller, Post } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
	constructor(private readonly pagosService: PagosService) {}

	@Post('generar-orden')
	async generarOrden() {
		return this.pagosService.generarOrden();
	}
}
