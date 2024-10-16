import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { comparePlainToHash, plainToHash } from './utils/handleBcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { TuristaDto } from 'src/modules/usuarios/dto/turista.dto';
import { PrestadorTuristicoDto } from 'src/modules/usuarios/dto/prestador-turistico.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { AuthRepositoryService } from './auth-repository.service';
import { AccountAuthDto } from './dto/account-auth.dto';
import { VerifyAccountAuthDto } from './dto/verify-account-auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly eventEmitter: EventEmitter2,
		private readonly authReposirotyService: AuthRepositoryService,
	) {}

	async registrarCuenta(registrarCuentaDto: AccountAuthDto) {
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
			throw new HttpException(
				result.descripcion,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		//enviar evento de mail
		this.eventEmitter.emit(
			'account.created',
			userModified.mail,
			userModified.codigo_verificacion,
		);

		return result;
	}

	async verificarCuenta(verificarCuentaDto: VerifyAccountAuthDto) {
		//Llamar al procedimiento
		const result =
			await this.authReposirotyService.verificarCuenta(
				verificarCuentaDto,
			);

		//comprobar si se verifico correctamente
		if (result.resultado === 'error') {
			throw new HttpException(result.descripcion, HttpStatus.CONFLICT);
		}

		return result;
	}

	async login(loginAuthDto: LoginAuthDto) {
		//Verificar si el usuario existe
		const userExists = await this.authReposirotyService.findOneUserByEmail(
			loginAuthDto.mail,
		);
		if (userExists.resultado === 'error') {
			throw new HttpException(
				userExists.descripcion,
				HttpStatus.BAD_REQUEST,
			);
		}

		//Verificar si el usuario esta verificado
		if (!userExists.verificado) {
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
		if (userExists.cant_perfiles === 0) {
			//firmar el token y devolverlo junto con los datos del usuario
			const payload = { id: userExists.id_usuario };
			const token = this.jwtService.sign(payload);
			const data = {
				token: token,
				tiene_perfil: false,
			};
			return data;
		}
		//consultar informacion del usuario
		const userInfo = await this.authReposirotyService.getUserInfo(
			userExists.id_usuario,
		);

		//firmar el token y devolverlo junto con los datos del usuario
		const payload = { id: userExists.id_usuario };
		const token = this.jwtService.sign(payload);
		const data = {
			token: token,
			user: userInfo,
			tiene_perfil: true,
		};
		return data;
	}

	// PARA PREGUNTAR: Pedir SP que registre al turista y devuelva el mail y el nombre del idioma
	async registrarTurista(turistaDto: TuristaDto) {
		//Llamar al procedimiento
		const result =
			await this.authReposirotyService.registrarTurista(turistaDto);

		//comprobar si se registro correctamente
		if (result.resultado === 'error') {
			throw new HttpException(result.descripcion, HttpStatus.CONFLICT);
		}

		//enviar evento de mail
		this.eventEmitter.emit(
			'turista.created',
			result.mail,
			result.idioma,
			turistaDto.nombre,
			turistaDto.apellido,
		);
		return result;
	}

	// PARA PREGUNTAR: Pedir SP que registre al prestador y devuelva el mail
	async registrarPrestador(prestadorTuristicoDto: PrestadorTuristicoDto) {
		//Llamar al procedimiento
		const result = await this.authReposirotyService.registrarPrestador(
			prestadorTuristicoDto,
		);

		//enviar evento de mail
		this.eventEmitter.emit(
			'prestador.created',
			result.mail,
			prestadorTuristicoDto.razon_social,
		);

		return result;
	}

	/* async registrarOficina(registrarOficinaDto: OficinaDto) {
		const { contraseña, ...user } = registrarOficinaDto;
		const userModified = {
			...user,
			contraseña: await plainToHash(contraseña),
		};

		const userCreated = userModified;

		//enviar evento de mail
		this.eventEmitter.emit('oficina.created', userCreated);

		return userCreated;
	} */
}
