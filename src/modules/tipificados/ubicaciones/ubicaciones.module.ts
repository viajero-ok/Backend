import { Module } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { UbicacionesController } from './ubicaciones.controller';
import { UbicacionesRepositoryService } from './ubicaciones-repository.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
	imports: [CacheModule.register()],
	controllers: [UbicacionesController],
	providers: [UbicacionesService, UbicacionesRepositoryService],
})
export class UbicacionesModule {}
