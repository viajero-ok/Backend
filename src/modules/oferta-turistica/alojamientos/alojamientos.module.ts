import { Module } from '@nestjs/common';
import { AlojamientosService } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos.service';
import { AlojamientosController } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos.controller';
import { AlojamientosRepositoryService } from './alojamiento-en-habitaciones/pestaña-alojamiento/alojamientos-repository.service';
import { HabitacionesController } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/habitaciones/habitaciones.controller';
import { HabitacionesService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/habitaciones/habitaciones.service';
import { HabitacionesRepositoryService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/habitaciones/habitaciones-repository.service';
import { AlojamientoParticularController } from './alojamiento-particular/alojamiento-particular.controller';
import { AlojamientoParticularService } from './alojamiento-particular/alojamiento-particular.service';
import { AlojamientoParticularRepositoryService } from './alojamiento-particular/alojamiento-particular-repository.service';
import { ViviendasController } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/viviendas/viviendas.controller';
import { ViviendasService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/viviendas/viviendas.service';
import { ViviendasRepositoryService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/viviendas/viviendas-repository.service';
import { ImagenesTipoDetalleController } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/imagenes/imagenes.controller';
import { ImagenesTipoDetalleService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/imagenes/imagenes-tipo-detalle.service';
import { ImagenesTipoDetalleRepositoryService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/imagenes/imagenes-tipo-detalle-repository.service';
import { CommonController } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/common/common.controller';
import { CommonService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/common/common.service';
import { CommonRepositoryService } from './alojamiento-en-habitaciones/pestaña-habitaciones-viviendas/common/common-repository.service';
@Module({
	controllers: [
		AlojamientosController,
		HabitacionesController,
		AlojamientoParticularController,
		ViviendasController,
		ImagenesTipoDetalleController,
		CommonController,
	],
	providers: [
		AlojamientosService,
		AlojamientosRepositoryService,
		HabitacionesService,
		HabitacionesRepositoryService,
		AlojamientoParticularService,
		AlojamientoParticularRepositoryService,
		ViviendasService,
		ViviendasRepositoryService,
		ImagenesTipoDetalleService,
		ImagenesTipoDetalleRepositoryService,
		CommonService,
		CommonRepositoryService,
	],
})
export class AlojamientosModule {}
