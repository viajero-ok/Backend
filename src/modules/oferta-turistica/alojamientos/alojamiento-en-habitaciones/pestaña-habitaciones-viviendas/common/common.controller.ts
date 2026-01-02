import { Controller, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonService } from './common.service';

@ApiTags('Alojamientos/Común')
@Controller('alojamientos/alojamiento-con-tipologias')
export class CommonController {
	constructor(private readonly commonService: CommonService) {}

	@ApiOperation({ summary: 'FINALIZAR REGISTRO ALOJAMIENTO' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				resultado: { type: 'string', example: 'ok' },
				statusCode: { type: 'number', example: 200 },
			},
		},
	})
	@Post('finalizar-registro-alojamiento/:id_oferta')
	async finalizarRegistroAlojamiento(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.commonService.finalizarRegistroAlojamiento(
			req,
			id_oferta,
		);
	}
}
