import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { EventoRepositoryService } from './pestaña-evento/evento-repository.service';
import { EventoController } from './pestaña-evento/evento.controller';
import { EventoService } from './pestaña-evento/evento.service';
import { RedesSocialesRepositoryService } from './pestaña-redes-sociales/redes-sociales-repository.service';
import { RedesSocialesController } from './pestaña-redes-sociales/redes-sociales.controller';
import { RedesSocialesService } from './pestaña-redes-sociales/redes-sociales.service';
import { EntradasController } from './pestaña-horario-entradas/entradas.controller';
import { EntradasService } from './pestaña-horario-entradas/entradas.service';
import { HorariosEntradasRepositoryService } from '../actividades/pestaña-horarios-entradas/horarios-entradas-repository.service';
import { EntradasRepositoryService } from './pestaña-horario-entradas/entradas-repository.service';
import { PublicarEventoController } from './publicar/publicar-evento.controller';
import { PublicarEventoService } from './publicar/publicar-evento.service';
import { PublicarEventoRepositoryService } from './publicar/publicar-evento.repository-service';

@Module({
	controllers: [
		EventosController,
		EventoController,
		RedesSocialesController,
		EntradasController,
		PublicarEventoController,
	],
	providers: [
		EventosService,
		EventoService,
		EventoRepositoryService,
		RedesSocialesService,
		RedesSocialesRepositoryService,
		EntradasService,
		EntradasRepositoryService,
		HorariosEntradasRepositoryService,
		PublicarEventoService,
		PublicarEventoRepositoryService,
	],
})
export class EventosModule {}
