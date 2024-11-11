import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ReportesDto } from './dto/reportes.dto';

@Injectable()
export class ReportesRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerReporteReservas(req, reportesDto: ReportesDto) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_REPORTE_RESERVAS_PRESTADOR(?, ?, ?)',
			[
				req.user.id_usuario,
				reportesDto.fecha_inicio,
				reportesDto.fecha_fin,
			],
		);
		return result[0];
	}

	async obtenerReporteTuristas(req, reportesDto: ReportesDto) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_ESTADISTICA_TURISTAS(?, ?, ?)',
			[
				req.user.id_usuario,
				reportesDto.fecha_inicio,
				reportesDto.fecha_fin,
			],
		);
		return result[0];
	}
}
