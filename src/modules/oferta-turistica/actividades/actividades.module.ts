import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { ActividadesRepositoryService } from './actividades-repository.service';
import { TarifasValidator } from './utils/tarifas.validator';

@Module({
	controllers: [ActividadesController],
	providers: [
		ActividadesService,
		ActividadesRepositoryService,
		TarifasValidator,
	],
})
export class ActividadesModule {}
