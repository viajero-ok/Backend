import { Controller, Query, Req, Get } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportesDto } from './dto/reportes.dto';

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('reportes')
export class ReportesController {
	constructor(private readonly reportesService: ReportesService) {}

	@Get('reservas')
	@ApiOperation({ summary: 'Obtener reporte de reservas' })
	obtenerReporteReservas(
		@Req() req: Request,
		@Query() reportesDto: ReportesDto,
	) {
		return this.reportesService.obtenerReporteReservas(req, reportesDto);
	}

	@Get('turistas')
	@ApiOperation({ summary: 'Obtener reporte de turistas' })
	obtenerReporteTuristas(
		@Req() req: Request,
		@Query() reportesDto: ReportesDto,
	) {
		return this.reportesService.obtenerReporteTuristas(req, reportesDto);
	}
}
