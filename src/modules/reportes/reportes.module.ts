import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { ReportesRepositoryService } from './reportes-repository.service';

@Module({
	controllers: [ReportesController],
	providers: [ReportesService, ReportesRepositoryService],
})
export class ReportesModule {}
