import { Module } from '@nestjs/common';
import { AlojamientosService } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos.service';
import { AlojamientosController } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos.controller';
import { AlojamientosRepositoryService } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos-repository.service';
import { HabitacionesController } from './alojamiento-en-habitaciones/pestaña-habitaciones/habitaciones.controller';
import { HabitacionesService } from './alojamiento-en-habitaciones/pestaña-habitaciones/habitaciones.service';
import { HabitacionesRepositoryService } from './alojamiento-en-habitaciones/pestaña-habitaciones/habitaciones-repository.service';

@Module({
	controllers: [AlojamientosController, HabitacionesController],
	providers: [
		AlojamientosService,
		AlojamientosRepositoryService,
		HabitacionesService,
		HabitacionesRepositoryService,
	],
})
export class AlojamientosModule {}
