import { PartialType } from '@nestjs/swagger';
import { UsuarioDto } from './usuario.dto';

export class UpdateUsuarioDto extends PartialType(UsuarioDto) {}
