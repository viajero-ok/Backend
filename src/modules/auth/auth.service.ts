import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { comparePlainToHash, plainToHash } from './utils/handleBcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { AuthRepositoryService } from './auth-repository.service';
import { CuentaAuthDto } from './dto/cuenta-auth.dto';
import { VerificarCuentaDto } from './dto/verificar-cuenta.dto';
import { RegistrarTuristaDto } from './dto/registrar-turista.dto';
import { RegistrarPrestadorDto } from './dto/registrar-prestador.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Profile } from 'passport';
import { DataLoginDto } from './dto/data-login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly eventEmitter: EventEmitter2,
		private readonly authReposirotyService: AuthRepositoryService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async registrarCuenta(registrarCuentaDto: CuentaAuthDto) {
		const { contraseña: contraseña, ...user } = registrarCuentaDto;

		//Generar codigo de verificacion
		const randomEightDigitNumber = Math.floor(Math.random() * 1e8)
			.toString()
			.padStart(8, '0');

		//Hashear la contraseña y agregar el codigo de verificacion
		const userModified = {
			...user,
			contraseña: await plainToHash(contraseña),
			codigo_verificacion: randomEightDigitNumber,
		};

		//Llamar al procedimiento
		const result =
			await this.authReposirotyService.registrarCuenta(userModified);

		//comprobar si se registro correctamente
		if (result.resultado === 'error') {
			throw new HttpException(result.descripcion, HttpStatus.CONFLICT);
		}

		//enviar evento de mail
		this.eventEmitter.emit(
			'account.created',
			userModified.mail,
			userModified.codigo_verificacion,
			result.id_usuario,
		);

		return {
			resultado: 'ok',
			statusCode: 201,
			id_usuario: result.id_usuario,
		};
	}

	async verificarCuenta(verificarCuentaDto: VerificarCuentaDto) {
		//Llamar al procedimiento
		const result =
			await this.authReposirotyService.verificarCuenta(
				verificarCuentaDto,
			);

		//comprobar si se verifico correctamente
		if (result.resultado === 'error') {
			throw new HttpException(result.descripcion, HttpStatus.CONFLICT);
		}

		if (result.nro_intentos >= 3) {
			throw new HttpException(
				'Superó el máximo de 3 intentos de verificación, debe volver a crear su cuenta.',
				HttpStatus.FORBIDDEN,
			);
		}

		return { resultado: 'ok', statusCode: 201 };
	}

	async googleStrategyLogin(profile: Profile) {
		// verificar si el usuario ya existe
		const userExists =
			await this.authReposirotyService.buscarUsuarioPorMail(
				profile.emails[0].value,
			);

		let usuarioRegistrado;

		//Si el usuario no existe, se registra
		if (!userExists) {
			usuarioRegistrado =
				await this.authReposirotyService.registrarCuenta({
					mail: profile.emails[0].value,
					contraseña: null,
					codigo_verificacion: null,
				});
			if (usuarioRegistrado.resultado === 'error') {
				throw new HttpException(
					'Error al registrar usuario',
					HttpStatus.CONFLICT,
				);
			}
		} else {
			usuarioRegistrado = userExists;
		}
		return {
			id_usuario: usuarioRegistrado.id_usuario,
			mail: profile.emails[0].value,
		};
	}

	async googleLogin(req): Promise<DataLoginDto> {
		//Verificar si el usuario ya esta logueado
		if (!req.user) {
			throw new HttpException(
				'Usuario no autorizado',
				HttpStatus.UNAUTHORIZED,
			);
		}
		const user = req.user;
		// verificar si el usuario ya existe
		const userExists =
			await this.authReposirotyService.obtenerUsuarioPorMail(user.mail);

		//Si el usuario no existe, se registra
		if (userExists.descripcion === 'Error al obtener usuario. ') {
			throw new HttpException(
				'Error al iniciar sesion con google',
				HttpStatus.CONFLICT,
			);
		}

		//Verificar si el usuario tiene perfiles
		const perfilesUsuario =
			await this.authReposirotyService.obtenerPerfilesUsuario(
				userExists.id_usuario,
			);
		const tiene_perfil = perfilesUsuario.length > 0;

		//firmar el token y devolverlo junto con los datos del usuario
		const payload = { id: userExists.id_usuario };
		const token = this.jwtService.sign(payload);
		const data: DataLoginDto = {
			resultado: 'ok',
			statusCode: 200,
			id_usuario: userExists.id_usuario,
			token: token,
			tiene_perfil,
		};

		// Agregar la propiedad "perfiles" si tiene_perfil es true
		if (data.tiene_perfil) {
			data.perfiles = perfilesUsuario.map((perfil) => ({
				id_perfil: perfil.id_perfil,
				nombre: perfil.tx_perfil,
			}));
		}
		return data;
	}

	async login(loginAuthDto: LoginAuthDto): Promise<DataLoginDto> {
		//Llamar al procedimiento
		const userExists =
			await this.authReposirotyService.obtenerUsuarioPorMail(
				loginAuthDto.mail,
			);
		console.log(userExists);

		//Verificar si el usuario existe
		if (userExists.resultado === 'error') {
			if (userExists.descripcion === 'Error al obtener usuario. ') {
				throw new HttpException(
					'Credenciales invalidas',
					HttpStatus.FORBIDDEN,
				);
			} else {
				throw new HttpException(
					userExists.descripcion,
					HttpStatus.BAD_REQUEST,
				);
			}
		}

		//Verificar si el usuario esta verificado
		if (userExists.verificado == 0) {
			throw new HttpException(
				'Email no verificado',
				HttpStatus.FORBIDDEN,
			);
		}

		//Verificar si la contraseña es correcta
		const isPasswordValid = await comparePlainToHash(
			loginAuthDto.contraseña,
			userExists.contraseña,
		);
		if (!isPasswordValid) {
			throw new HttpException(
				'Credenciales invalidas',
				HttpStatus.UNAUTHORIZED,
			);
		}

		//Verificar si el usuario tiene perfiles
		const perfilesUsuario =
			await this.authReposirotyService.obtenerPerfilesUsuario(
				userExists.id_usuario,
			);
		const tiene_perfil = perfilesUsuario.length > 0;

		//firmar el token y devolverlo junto con los datos del usuario
		const payload = { id: userExists.id_usuario };
		const token = this.jwtService.sign(payload);
		const data: DataLoginDto = {
			resultado: 'ok',
			statusCode: 200,
			id_usuario: userExists.id_usuario,
			token: token,
			tiene_perfil,
		};

		// Agregar la propiedad "perfiles" si tiene_perfil es true
		if (data.tiene_perfil) {
			data.perfiles = perfilesUsuario.map((perfil) => ({
				id_perfil: perfil.id_perfil,
				nombre: perfil.nombre_perfil,
			}));
		}
		return data;
	}

	async registrarTurista(registrarTuristaDto: RegistrarTuristaDto, req) {
		registrarTuristaDto.id_usuario = req.user.id_usuario;
		//Llamar al procedimiento
		const registro =
			await this.authReposirotyService.registrarTurista(
				registrarTuristaDto,
			);

		//comprobar si se registro correctamente
		if (registro.resultado === 'error') {
			console.log(registro.descripcion);
			throw new HttpException(
				'Error al registrar turista.',
				HttpStatus.CONFLICT,
			);
		}

		const result =
			await this.authReposirotyService.obtenerInfoUsuarioPorPerfil(
				registrarTuristaDto.id_usuario,
				1,
			);

		//enviar evento de mail
		this.eventEmitter.emit(
			'turista.created',
			result.mail,
			result.idioma,
			result.nombre,
			result.apellido,
		);
		return { resultado: 'ok', statusCode: 201 };
	}

	async registrarPrestador(
		registrarPrestadorDto: RegistrarPrestadorDto,
		req,
	) {
		registrarPrestadorDto.id_usuario = req.user.id_usuario;
		//Llamar al procedimiento
		const registro = await this.authReposirotyService.registrarPrestador(
			registrarPrestadorDto,
		);

		//comprobar si se registro correctamente
		if (registro.resultado === 'error') {
			throw new HttpException(
				'Error al registrar prestador.',
				HttpStatus.CONFLICT,
			);
		}

		const result =
			await this.authReposirotyService.obtenerInfoUsuarioPorPerfil(
				registrarPrestadorDto.id_usuario,
				2,
			);

		//enviar evento de mail
		this.eventEmitter.emit(
			'prestador.created',
			result.mail,
			result.razon_social,
		);

		return { resultado: 'ok', statusCode: 201 };
	}

	async obtenerDatosRegistro(perfil: string) {
		const cacheKey = 'datos_registro';
		let result = await this.cacheManager.get(cacheKey);

		//si no esta en cache
		if (!result) {
			//llamar al procedimiento
			result =
				await this.authReposirotyService.obtenerDatosRegistro(perfil);
			await this.cacheManager.set(cacheKey, result);
		}

		return { resultado: 'ok', statusCode: 200, datos_registro: result };
	}

	async obtenerDatosUsuario(user) {
		if (!user) {
			throw new HttpException(
				'Usuario no autorizado',
				HttpStatus.UNAUTHORIZED,
			);
		}
		/* const result = await this.authReposirotyService.obtenerInfoUsuarioPorId(
			user.id,
		); */
		//Verificar si el usuario tiene perfiles
		const perfilesUsuario =
			await this.authReposirotyService.obtenerPerfilesUsuario(
				user.id_usuario,
			);

		const datos_usuario_perfil: { [key: string]: any } = {};
		for (const perfil of perfilesUsuario) {
			const datos_perfil =
				await this.authReposirotyService.obtenerInfoUsuarioPorPerfil(
					user.id_usuario,
					perfil.id_perfil,
				);
			if (perfil.nombre_perfil === 'Turista') {
				datos_usuario_perfil.datos_turista = datos_perfil;
			} else if (perfil.nombre_perfil === 'Prestador') {
				datos_usuario_perfil.datos_prestador = datos_perfil;
			}
		}
		const tiene_perfil = perfilesUsuario.length > 0;
		return {
			resultado: 'ok',
			statusCode: 200,
			datos_usuario_perfil,
			tiene_perfil: tiene_perfil,
			perfilesUsuario: perfilesUsuario,
		};
	}
}
