import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { ReservasRepositoryService } from './reservas-repository.service';

@Module({
	controllers: [ReservasController],
	providers: [ReservasService, ReservasRepositoryService],
})
export class ReservasModule {}
