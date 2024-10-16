import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { PagosRepositoryService } from './pagos-repository.service';

@Module({
	controllers: [PagosController],
	providers: [PagosService, PagosRepositoryService],
})
export class PagosModule {}
