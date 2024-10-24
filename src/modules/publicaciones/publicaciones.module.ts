import { Module } from '@nestjs/common';
import { PublicacionesAlojamientosController } from './alojamientos/publicaciones-alojamientos.controller';
import { PublicacionesActividadesController } from './actividades/publicaciones-actividades.controller';
import { PublicacionesActividadesService } from './actividades/publicaciones-actividades.service';
import { PublicacionesAlojamientosService } from './alojamientos/publicaciones-alojamientos.service';
import { PublicacionesAlojamientosRepositoryService } from './alojamientos/publicaciones-alojamientos-repository.service';
import { PublicacionesActividadesRepositoryService } from './actividades/publicaciones-actividades-repository.service';
import { TarifasValidator } from './actividades/utils/tarifas.validator';

@Module({
	controllers: [
		PublicacionesAlojamientosController,
		PublicacionesActividadesController,
	],
	providers: [
		PublicacionesActividadesService,
		PublicacionesActividadesRepositoryService,
		PublicacionesAlojamientosService,
		PublicacionesAlojamientosRepositoryService,
		TarifasValidator,
	],
})
export class PublicacionesModule {}
