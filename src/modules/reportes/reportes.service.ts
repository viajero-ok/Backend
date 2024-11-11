import { Injectable } from '@nestjs/common';
import { ReportesRepositoryService } from './reportes-repository.service';
import { ReportesDto } from './dto/reportes.dto';

@Injectable()
export class ReportesService {
	constructor(
		private readonly reportesRepository: ReportesRepositoryService,
	) {}

	async obtenerReporteReservas(req, reportesDto: ReportesDto) {
		return this.reportesRepository.obtenerReporteReservas(req, reportesDto);
	}

	async obtenerReporteTuristas(req, reportesDto: ReportesDto) {
		return this.reportesRepository.obtenerReporteTuristas(req, reportesDto);
	}
}
