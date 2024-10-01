import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { ActividadesRepositoryService } from './actividades-repository.service';

@Module({
	controllers: [ActividadesController],
	providers: [ActividadesService, ActividadesRepositoryService],
})
export class ActividadesModule {}
