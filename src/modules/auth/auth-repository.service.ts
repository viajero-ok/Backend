import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { TuristaDto } from 'src/modules/usuarios/dto/turista.dto';
import { PrestadorTuristicoDto } from 'src/modules/usuarios/dto/prestador-turistico.dto';
import { AccountAuthDto } from './dto/account-auth.dto';
import { VerifyAccountAuthDto } from './dto/verify-account-auth.dto';

@Injectable()
export class AuthRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
		@InjectRepository(Usuario)
		private usersRepository: Repository<Usuario>,
	) {}

	async findOneUserByEmail(MAIL: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_USUARIO_X_EMAIL(?)',
			[MAIL],
		);
		return result[0][0];
	}

	async getUserInfo(ID_USUARIO: string) {
		const result = await this.entityManager.query('CALL SP_USER_INFO(?)', [
			ID_USUARIO,
		]);
		return result[0][0];
	}

	async verificarCuenta(verificarCuentaDto: VerifyAccountAuthDto) {
		const result = await this.entityManager.query(
			'CALL SP_VERIFICAR_CUENTA(?, ?)',
			[
				verificarCuentaDto.id_usuario,
				verificarCuentaDto.codigo_verificacion,
			],
		);
		return result[0][0];
	}

	async registrarCuenta(registrarCuentaDto: AccountAuthDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_USUARIOS(?, ?, ?, ?, ?, ?, ?)',
			[
				registrarCuentaDto.mail,
				null,
				null,
				null,
				registrarCuentaDto.contraseña,
				null,
				registrarCuentaDto.codigo_verificacion,
			],
		);
		return result[0][0];
	}

	async findOneUserById(id: string) {
		return this.usersRepository.findOne({
			where: { ID_USUARIO: id },
		});
	}

	// PARA PREGUNTAR: Pedirle a fede un SP que devuelva el usuario por ID
	async findUserById(id: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_USUARIO_X_ID(?)',
			[id],
		);
		return result[0][0];
	}

	async registrarTurista(turistaDto: TuristaDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_USUARIOS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				//userModified.mail,
				turistaDto.nombre,
				turistaDto.apellido,
				turistaDto.fecha_nacimiento,
				//userModified.contraseña,
				turistaDto.id_genero,
				turistaDto.nro_documento_identidad,
				turistaDto.id_tipo_documento,
				turistaDto.id_localidad_origen,
				turistaDto.id_idioma,
				null,
			],
		);
		return result[0][0];
	}

	async registrarPrestador(prestadorTuristicoDto: PrestadorTuristicoDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_USUARIOS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				//prestadorTuristico.mail,
				prestadorTuristicoDto.nombre,
				prestadorTuristicoDto.apellido,
				prestadorTuristicoDto.fecha_nacimiento,
				//prestadorTuristico.contraseña,
				//prestadorTuristico.id_genero,
				//prestadorTuristico.NRO_DOCUMENTO_IDENTIDAD,
				//prestadorTuristico.ID_TIPO_DOCUMENTO,
				//prestadorTuristico.ID_LOCALIDAD_ORIGEN,
				//prestadorTuristico.ID_IDIOMA,
				null,
			],
		);
		return result;
	}
}
