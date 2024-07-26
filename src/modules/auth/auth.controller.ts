import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { OficinaDto } from 'src/modules/usuarios/dto/oficina.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public/public.decorator';
import { CuentaAuthDto } from './dto/cuenta-auth.dto';
import { VerificarCuentaDto } from './dto/verificar-cuenta.dto';
import { RegistrarTuristaDto } from './dto/registrar-turista.dto';
import { RegistrarPrestadorDto } from './dto/registrar-prestador.dto';

@ApiTags('Auth')
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
	async registrarCuenta(@Body() registrarCuentaDto: CuentaAuthDto) {
		return this.authService.registrarCuenta(registrarCuentaDto);
	}

	@Public()
	@Post('verificar/cuenta')
	async verificarCuenta(@Body() verificarCuentaDto: VerificarCuentaDto) {
		return this.authService.verificarCuenta(verificarCuentaDto);
	}

	@ApiBearerAuth()
	@Post('registrar/turista')
	async registrarTurista(@Body() registrarTuristaDto: RegistrarTuristaDto) {
		return this.authService.registrarTurista(registrarTuristaDto);
	}

	@ApiBearerAuth()
	@Post('registrar/prestador')
	async registrarPrestador(
		@Body() registrarPrestadorDto: RegistrarPrestadorDto,
	) {
		return this.authService.registrarPrestador(registrarPrestadorDto);
	}

	@ApiBearerAuth()
	@Post('registrar/oficina')
	async registrarOficina(@Body() registrarOficinaDto: OficinaDto) {
		return 'Oficina registrada con éxito: ' + registrarOficinaDto;
	}
}
