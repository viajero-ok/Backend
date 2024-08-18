import { Controller } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('eventos')
export class EventosController {
	constructor(private readonly eventosService: EventosService) {}
}
