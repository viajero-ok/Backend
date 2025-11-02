import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { EventoService } from './pestaña-evento/evento.service';
import { EventoRepositoryService } from './pestaña-evento/evento-repository.service';
import { EventoController } from './pestaña-evento/evento.controller';

@Module({
	controllers: [EventosController, EventoController],
	providers: [EventosService, EventoService, EventoRepositoryService],
})
export class EventosModule {}
