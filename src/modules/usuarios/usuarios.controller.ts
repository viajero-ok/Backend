import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuarioDto } from './dto/usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

//@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
	constructor(private readonly usuariosService: UsuariosService) {}

	@Post()
	create(@Body() usuarioDto: UsuarioDto) {
		return this.usuariosService.create(usuarioDto);
	}

	@Get()
	findAll() {
		return this.usuariosService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usuariosService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateUsuarioDto: UpdateUsuarioDto,
	) {
		return this.usuariosService.update(+id, updateUsuarioDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usuariosService.remove(+id);
	}
}
