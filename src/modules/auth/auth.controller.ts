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
	@ApiOperation({ summary: 'REGISTRAR CUENTA' })
	@ApiResponse({
		status: 201,
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'number',
					example: 201,
				},
				id_usuario: {
					type: 'string',
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
				statusCode: {
					type: 'number',
					example: 201,
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
						'Error al verificar usuario. El código ingresado no es correcto. ',
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'number',
					example: 403,
				},
				message: {
					type: 'string',
					example:
						'Superó el máximo de 3 intentos de verificación, debe volver a crear su cuenta.',
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
		status: 200,
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'string',
					example: 200,
				},
				id_usuario: {
					type: 'string',
				},
				token: {
					type: 'string',
				},
				tiene_perfil: {
					type: 'boolean',
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'string',
					example: 403,
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
	@Public()
	@ApiOperation({ summary: 'LOGIN' })
	@Post('login')
	async login(@Body() loginAuthDto: LoginAuthDto) {
		return this.authService.login(loginAuthDto);
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
				statusCode: {
					type: 'number',
					example: 201,
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
					example: 'Error al registrar turista.',
				},
			},
		},
	})
	@ApiBearerAuth()
	@ApiOperation({ summary: 'REGISTRAR TURISTA' })
	@Post('registrar/turista')
	async registrarTurista(@Body() registrarTuristaDto: RegistrarTuristaDto) {
		return this.authService.registrarTurista(registrarTuristaDto);
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
				statusCode: {
					type: 'number',
					example: 201,
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
					example: 'Error al registrar prestador.',
				},
			},
		},
	})
	@ApiBearerAuth()
	@ApiOperation({ summary: 'REGISTRAR PRESTADOR' })
	@Post('registrar/prestador')
	async registrarPrestador(
		@Body() registrarPrestadorDto: RegistrarPrestadorDto,
	) {
		return this.authService.registrarPrestador(registrarPrestadorDto);
	}
}
