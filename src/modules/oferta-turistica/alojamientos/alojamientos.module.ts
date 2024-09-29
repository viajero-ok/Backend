import { Module } from '@nestjs/common';
import { AlojamientosService } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos.service';
import { AlojamientosController } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos.controller';
import { AlojamientosRepositoryService } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos-repository.service';
import { TarifasValidator } from './alojamiento-en-habitaciones/utils/tarifas.validator';
import { HabitacionesController } from './alojamiento-en-habitaciones/pestaña-habitaciones/habitaciones.controller';
import { TarifasController } from './alojamiento-en-habitaciones/pestaña-tarfifas/tarifas.controller';
import { HabitacionesService } from './alojamiento-en-habitaciones/pestaña-habitaciones/habitaciones.service';
import { HabitacionesRepositoryService } from './alojamiento-en-habitaciones/pestaña-habitaciones/habitaciones-repository.service';
import { TarifasService } from './alojamiento-en-habitaciones/pestaña-tarfifas/tarifas.service';
import { TarifasRepositoryService } from './alojamiento-en-habitaciones/pestaña-tarfifas/tarifas-repository.service';

@Module({
	controllers: [
		AlojamientosController,
		HabitacionesController,
		TarifasController,
	],
	providers: [
		AlojamientosService,
		AlojamientosRepositoryService,
		HabitacionesService,
		HabitacionesRepositoryService,
		TarifasService,
		TarifasRepositoryService,
		TarifasValidator,
	],
})
export class AlojamientosModule {}
