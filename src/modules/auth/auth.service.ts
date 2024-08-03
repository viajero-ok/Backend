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

	async login(loginAuthDto: LoginAuthDto) {
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
		const tiene_perfil = userExists.cantidad_perfiles > 0;

		//firmar el token y devolverlo junto con los datos del usuario
		const payload = { id: userExists.id_usuario };
		const token = this.jwtService.sign(payload);
		const data = {
			resultado: 'ok',
			statusCode: 200,
			id_usuario: userExists.id_usuario,
			token: token,
			tiene_perfil,
		};
		return data;
	}

	async registrarTurista(registrarTuristaDto: RegistrarTuristaDto) {
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

		const result = await this.authReposirotyService.obtenerInfoUsuario(
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

	async registrarPrestador(registrarPrestadorDto: RegistrarPrestadorDto) {
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

		const result = await this.authReposirotyService.obtenerInfoUsuario(
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
}
