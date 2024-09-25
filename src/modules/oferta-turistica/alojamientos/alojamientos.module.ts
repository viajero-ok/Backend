import { Module } from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import { AlojamientosController } from './alojamientos.controller';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';
import { TarifasValidator } from '../utils/tarifas.validator';

@Module({
	controllers: [AlojamientosController],
	providers: [
		AlojamientosService,
		AlojamientosRepositoryService,
		TarifasValidator,
	],
})
export class AlojamientosModule {}
