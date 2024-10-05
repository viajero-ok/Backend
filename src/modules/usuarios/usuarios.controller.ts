import { Controller } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

//@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
	constructor(private readonly usuariosService: UsuariosService) {}
}
