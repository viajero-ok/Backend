import { Module } from '@nestjs/common';
import { EstablecimientosService } from './establecimientos.service';
import { EstablecimientosController } from './establecimientos.controller';
import { EstablecimientosRepositoryService } from './establecimientos-repository.service';

@Module({
	controllers: [EstablecimientosController],
	providers: [EstablecimientosService, EstablecimientosRepositoryService],
})
export class EstablecimientosModule {}
