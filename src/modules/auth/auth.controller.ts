import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { TuristaDto } from 'src/modules/usuarios/dto/turista.dto';
import { PrestadorTuristicoDto } from 'src/modules/usuarios/dto/prestador-turistico.dto';
import { OficinaDto } from 'src/modules/usuarios/dto/oficina.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public/public.decorator';
import { AccountAuthDto } from './dto/account-auth.dto';
import { VerifyAccountAuthDto } from './dto/verify-account-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('login')
	async login(@Body() loginAuthDto: LoginAuthDto) {
		return this.authService.login(loginAuthDto);
	}

	@Public()
	@Post('registrar/cuenta')
	async registrarCuenta(@Body() registrarCuentaDto: AccountAuthDto) {
		return this.authService.registrarCuenta(registrarCuentaDto);
	}

	@Public()
	@Post('verificar/cuenta')
	async verificarCuenta(@Body() verificarCuentaDto: VerifyAccountAuthDto) {
		return this.authService.verificarCuenta(verificarCuentaDto);
	}

	@ApiBearerAuth()
	@Post('registrar/turista')
	async registrarTurista(@Body() registrarTuristaDto: TuristaDto) {
		return this.authService.registrarTurista(registrarTuristaDto);
	}

	@ApiBearerAuth()
	@Post('registrar/prestador')
	async registrarPrestador(
		@Body() registrarPrestadorDto: PrestadorTuristicoDto,
	) {
		return this.authService.registrarPrestador(registrarPrestadorDto);
	}

	@ApiBearerAuth()
	@Post('registrar/oficina')
	async registrarOficina(@Body() registrarOficinaDto: OficinaDto) {
		return 'Oficina registrada con éxito: ' + registrarOficinaDto;
	}
}
