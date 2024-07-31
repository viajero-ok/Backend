import { Module } from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import { AlojamientosController } from './alojamientos.controller';

@Module({
	controllers: [AlojamientosController],
	providers: [AlojamientosService],
})
export class AlojamientosModule {}
