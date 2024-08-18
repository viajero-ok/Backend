import { Module } from '@nestjs/common';
import { OfertaTuristicaService } from './oferta-turistica.service';
import { OfertaTuristicaController } from './oferta-turistica.controller';
import { OfertaTuristicaRepositoryService } from './oferta-turistica-repository.service';
import { EstablecimientosModule } from './establecimientos/establecimientos.module';
import { AlojamientosModule } from './alojamientos/alojamientos.module';
import { ActividadesModule } from './actividades/actividades.module';
import { EventosModule } from './eventos/eventos.module';

@Module({
	controllers: [OfertaTuristicaController],
	providers: [OfertaTuristicaService, OfertaTuristicaRepositoryService],
	imports: [
		EstablecimientosModule,
		AlojamientosModule,
		ActividadesModule,
		EventosModule,
	],
})
export class OfertaTuristicaModule {}
