import { Controller } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Actividades')
@ApiBearerAuth()
@Controller('actividades')
export class ActividadesController {
	constructor(private readonly actividadesService: ActividadesService) {}
}
