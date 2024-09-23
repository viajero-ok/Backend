import { Module } from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import { AlojamientosController } from './alojamientos.controller';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';

@Module({
	controllers: [AlojamientosController],
	providers: [AlojamientosService, AlojamientosRepositoryService],
})
export class AlojamientosModule {}
