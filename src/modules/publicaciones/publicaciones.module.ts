import { Module } from '@nestjs/common';
import { PublicacionesAlojamientosController } from './alojamientos/publicaciones-alojamientos.controller';
import { PublicacionesActividadesController } from './actividades/publicaciones-actividades.controller';
import { PublicacionesActividadesService } from './actividades/publicaciones-actividades.service';
import { PublicacionesAlojamientosService } from './alojamientos/publicaciones-alojamientos.service';
import { PublicacionesAlojamientosRepositoryService } from './alojamientos/publicaciones-alojamientos-repository.service';
import { PublicacionesActividadesRepositoryService } from './actividades/publicaciones-actividades-repository.service';
import { TarifasValidator as TarifasValidatorAlojamientos } from './alojamientos/utils/tarifas.validator';
import { TarifasValidator as TarifasValidatorActividades } from './actividades/utils/tarifas.validator';

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
		TarifasValidatorActividades,
		TarifasValidatorAlojamientos,
	],
})
export class PublicacionesModule {}
