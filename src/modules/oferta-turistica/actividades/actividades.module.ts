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
import { GuiasController } from './pestaña-guias/guias.controller';
import { GuiasService } from './pestaña-guias/guias.services';
import { GuiasRepositoryService } from './pestaña-guias/guias-repository.service';
import { ImagenesController } from './pestaña-imagenes/imagenes.controller';
import { ImagenesService } from './pestaña-imagenes/imagenes.service';
import { ImagenesRepositoryService } from './pestaña-imagenes/imagenes-repository.service';
import { RegistrarController } from './registrar/registrar.controller';
import { RegistrarService } from './registrar/registrar.service';
import { RegistrarRepositoryService } from './registrar/registrar-repository.service';

@Module({
	controllers: [
		ActividadController,
		GuiasController,
		HorariosEntradasController,
		UbicacionController,
		ImagenesController,
		RegistrarController,
	],
	providers: [
		ActividadService,
		ActividadRepositoryService,
		GuiasService,
		GuiasRepositoryService,
		HorariosEntradasService,
		HorariosEntradasRepositoryService,
		UbicacionService,
		UbicacionRepositoryService,
		ImagenesService,
		ImagenesRepositoryService,
		RegistrarService,
		RegistrarRepositoryService,
	],
})
export class ActividadesModule {}
