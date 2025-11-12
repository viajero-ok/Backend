import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { EventoRepositoryService } from './pestaña-evento/evento-repository.service';
import { EventoController } from './pestaña-evento/evento.controller';
import { EventoService } from './pestaña-evento/evento.service';
import { RedesSocialesRepositoryService } from './pestaña-redes-sociales/redes-sociales-repository.service';
import { RedesSocialesController } from './pestaña-redes-sociales/redes-sociales.controller';
import { RedesSocialesService } from './pestaña-redes-sociales/redes-sociales.service';

@Module({
	controllers: [EventosController, EventoController, RedesSocialesController],
	providers: [
		EventosService,
		EventoService,
		EventoRepositoryService,
		RedesSocialesService,
		RedesSocialesRepositoryService,
	],
})
export class EventosModule {}
