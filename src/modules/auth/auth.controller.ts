import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
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
	@ApiOperation({ summary: 'CREAR CUENTA' })
	@ApiResponse({
		status: 201,
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				descripcion: {
					type: 'string',
					nullable: true,
					example: null,
				},
				id_usuario: {
					type: 'string',
					example: 'e11e1111-1eee-11ee-11e1-1111ee111111',
				},
			},
		},
	})
	@Post('registrar/cuenta')
	async registrarCuenta(@Body() registrarCuentaDto: CuentaAuthDto) {
		return this.authService.registrarCuenta(registrarCuentaDto);
	}

	@ApiResponse({
		status: 201,
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				descripcion: {
					type: 'string',
					nullable: true,
					example: null,
				},
			},
		},
	})
	@Public()
	@ApiOperation({ summary: 'VERIFICAR CUENTA' })
	@Post('verificar/cuenta')
	async verificarCuenta(@Body() verificarCuentaDto: VerificarCuentaDto) {
		return this.authService.verificarCuenta(verificarCuentaDto);
	}

	@ApiResponse({
		status: 201,
		schema: {
			type: 'object',
			properties: {
				token: {
					type: 'string',
					example:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyNDMyYjIyLTQ5NTAtMTFlZi05N2QzLTAyNDJhYzEyMDAwMiIsImlhdCI6MTcyMjA0NTM0MSwiZXhwIjoxNzIyMTMxNzQxfQ.EuDx1RUvnsdBHTd3b69l1YgKMjvZLvOpEm5FrgigKRE',
				},
				tiene_perfil: {
					type: 'boolean',
					example: false,
				},
			},
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'string',
					example: 400,
				},
				message: {
					type: 'string',
					example: 'Email no verificado',
				},
			},
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'string',
					example: 401,
				},
				message: {
					type: 'string',
					example: 'Credenciales invalidas',
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'number',
					example: 409,
				},
				message: {
					type: 'string',
					example:
						'Error al crear usuario. Ya existe un usuario con el email ingresado. ',
				},
			},
		},
	})
	@Public()
	@ApiOperation({ summary: 'LOGIN' })
	@Post('login')
	async login(@Body() loginAuthDto: LoginAuthDto) {
		return this.authService.login(loginAuthDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'REGISTRAR TURISTA' })
	@Post('registrar/turista')
	async registrarTurista(@Body() registrarTuristaDto: RegistrarTuristaDto) {
		return this.authService.registrarTurista(registrarTuristaDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'REGISTRAR PRESTADOR' })
	@Post('registrar/prestador')
	async registrarPrestador(
		@Body() registrarPrestadorDto: RegistrarPrestadorDto,
	) {
		return this.authService.registrarPrestador(registrarPrestadorDto);
	}
}
