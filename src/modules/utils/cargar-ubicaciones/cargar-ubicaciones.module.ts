import { Module } from '@nestjs/common';
import { CargarUbicacionesService } from './cargar-ubicaciones.service';
import { CargarUbicacionesController } from './cargar-ubicaciones.controller';

@Module({
	controllers: [CargarUbicacionesController],
	providers: [CargarUbicacionesService],
})
export class CargarUbicacionesModule {}
