import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public/public.decorator';
import { CuentaAuthDto } from './dto/cuenta-auth.dto';
import { VerificarCuentaDto } from './dto/verificar-cuenta.dto';
import { RegistrarTuristaDto } from './dto/registrar-turista.dto';
import { RegistrarPrestadorDto } from './dto/registrar-prestador.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { GoogleGuard } from 'src/common/guards/authentication/google.guard';
import { Request } from 'express';
import { DataLoginDto } from './dto/data-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
	@Public()
	@Post('registrar/cuenta')
	async registrarCuenta(@Body() registrarCuentaDto: CuentaAuthDto) {
		return this.authService.registrarCuenta(registrarCuentaDto);
	}

	@ApiOperation({ summary: 'VERIFICAR CUENTA' })
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
	@Post('verificar/cuenta')
	async verificarCuenta(@Body() verificarCuentaDto: VerificarCuentaDto) {
		return this.authService.verificarCuenta(verificarCuentaDto);
	}

	@ApiOperation({ summary: 'LOGIN' })
	@ApiResponse({
		status: 200,
		type: DataLoginDto,
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
	@Post('login')
	async login(@Body() loginAuthDto: LoginAuthDto) {
		return this.authService.login(loginAuthDto);
	}

	@ApiOperation({ summary: 'OBTENER DATOS PARA REGISTRO SEGUN PERFIL' })
	@ApiQuery({
		name: 'perfil',
		enum: ['turista', 'prestador'],
		description: 'Perfil del usuario',
	})
	@ApiResponse({
		status: 200,
		description: 'Datos de registro para turista',
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'number',
					example: 200,
				},
				datos_registro: {
					type: 'object',
					properties: {
						idiomas: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_idioma: {
										type: 'string',
									},
									idioma: {
										type: 'string',
									},
								},
							},
						},
						generos: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_genero: {
										type: 'string',
									},
									genero: {
										type: 'string',
									},
								},
							},
						},
						tipos_documento: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_tipo_documento_identidad: {
										type: 'string',
									},
									tipo_documento_identidad: {
										type: 'string',
									},
								},
							},
						},
						ubicaciones: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									localidades: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id_localidad: {
													type: 'string',
												},
												localidad: { type: 'string' },
											},
										},
									},
									departamentos: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id_departamento: {
													type: 'string',
												},
												departamento: {
													type: 'string',
												},
											},
										},
									},
									provincias: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id_provincia: {
													type: 'string',
												},
												provincia: { type: 'string' },
											},
										},
									},
									paises: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id_pais: { type: 'string' },
												pais: { type: 'string' },
											},
										},
									},
								},
							},
						},
					},
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
					example: 'Error al iniciar sesion con google',
				},
			},
		},
	})
	@ApiBearerAuth()
	@UseInterceptors(CacheInterceptor)
	@CacheTTL(60 * 60 * 24 * 15) // 15 días en segundos
	@Get('datos-registro')
	async datosRegistro(@Query('perfil') perfil: string) {
		return this.authService.obtenerDatosRegistro(perfil);
	}

	@ApiOperation({ summary: 'REGISTRAR TURISTA' })
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
	@Post('registrar/turista')
	async registrarTurista(
		@Body() registrarTuristaDto: RegistrarTuristaDto,
		@Req() req: Request,
	) {
		return this.authService.registrarTurista(registrarTuristaDto, req);
	}

	@ApiOperation({ summary: 'REGISTRAR PRESTADOR' })
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
	@Post('registrar/prestador')
	async registrarPrestador(
		@Body() registrarPrestadorDto: RegistrarPrestadorDto,
		@Req() req: Request,
	) {
		return this.authService.registrarPrestador(registrarPrestadorDto, req);
	}

	@ApiOperation({ summary: 'GOOGLE LOGIN' })
	@ApiResponse({
		status: 200,
		type: DataLoginDto,
	})
	@Public()
	@Get('google/login')
	@UseGuards(GoogleGuard)
	async googleAuth() {
		return { msg: 'Google Authentication' };
	}

	@ApiOperation({ summary: 'REDIRECCIÓN QUE USA GOOGLE' })
	@Public()
	@Get('google/redirect')
	@UseGuards(GoogleGuard)
	async googleAuthRedirect(@Req() req: Request) {
		return await this.authService.googleLogin(req);
	}

	@ApiOperation({ summary: 'OBTENER DATOS USUARIO' })
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
					type: 'number',
					example: 201,
				},
				datos_usuario: {
					type: 'object',
				},
				tiene_perfil: {
					type: 'boolean',
				},
				perfilesUsuario: {
					type: 'array',
				},
			},
		},
	})
	@ApiBearerAuth()
	@Get('datos-usuario')
	async obtenerDatosUsuario(@Req() req: Request) {
		return await this.authService.obtenerDatosUsuario(req.user);
	}
}
