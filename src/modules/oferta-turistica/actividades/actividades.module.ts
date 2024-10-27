import { Module } from '@nestjs/common';
import { ActividadController } from './pestaña-actividad/actividad.controller';
import { HorariosEntradasController } from './pestaña-horarios-entradas/horarios-entradas.controller';
import { UbicacionController } from './pestaña-ubicacion/ubicacion.controller';
import { ActividadService } from './pestaña-actividad/actividad.service';
import { HorariosEntradasService } from './pestaña-horarios-entradas/horarios-entradas.service';
import { UbicacionService } from './pestaña-ubicacion/ubicacion.service';
import { ActividadRepositoryService } from './pestaña-actividad/actividad-repository.service';
import { HorariosEntradasRepositoryService } from './pestaña-horarios-entradas/horarios-entradas-repository.service';
import { UbicacionRepositoryService } from './pestaña-ubicacion/ubicacion-repository.service';

@Module({
	controllers: [
		ActividadController,
		HorariosEntradasController,
		UbicacionController,
	],
	providers: [
		ActividadService,
		ActividadRepositoryService,
		HorariosEntradasService,
		HorariosEntradasRepositoryService,
		UbicacionService,
		UbicacionRepositoryService,
	],
})
export class ActividadesModule {}
