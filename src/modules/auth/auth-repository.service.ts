import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { CuentaAuthDto } from './dto/cuenta-auth.dto';
import { VerificarCuentaDto } from './dto/verificar-cuenta.dto';
import { RegistrarTuristaDto } from './dto/registrar-turista.dto';
import { RegistrarPrestadorDto } from './dto/registrar-prestador.dto';

@Injectable()
export class AuthRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
		@InjectRepository(Usuario)
		private usersRepository: Repository<Usuario>,
	) {}

	async obtenerUsuarioPorMail(MAIL: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_USUARIO_X_EMAIL(?)',
			[MAIL],
		);
		return result[0][0];
	}

	async obtenerInfoUsuario(id_usuario: string, id_perfil: number) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_DATOS_USUARIO(?, ?)',
			[id_usuario, id_perfil],
		);
		return result[0][0];
	}

	async verificarCuenta(verificarCuentaDto: VerificarCuentaDto) {
		const result = await this.entityManager.query(
			'CALL SP_VERIFICAR_CUENTA(?, ?)',
			[
				verificarCuentaDto.id_usuario,
				verificarCuentaDto.codigo_verificacion,
			],
		);
		return result[0][0];
	}

	async registrarCuenta(registrarCuentaDto: CuentaAuthDto) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_USUARIOS(?, ?, ?, ?)',
			[
				registrarCuentaDto.mail,
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

	async registrarTurista(registrarTuristaDto: RegistrarTuristaDto) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_TURISTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				registrarTuristaDto.id_usuario,
				registrarTuristaDto.nombre,
				registrarTuristaDto.apellido,
				registrarTuristaDto.fecha_nacimiento,
				registrarTuristaDto.nro_documento_identidad,
				registrarTuristaDto.id_tipo_documento,
				registrarTuristaDto.telefono,
				registrarTuristaDto.id_localidad,
				registrarTuristaDto.id_departamento,
				registrarTuristaDto.id_provincia,
				registrarTuristaDto.id_pais,
				registrarTuristaDto.id_idioma,
				registrarTuristaDto.id_genero,
			],
		);
		return result[0][0];
	}

	async registrarPrestador(registrarPrestadorDto: RegistrarPrestadorDto) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_PRESTADOR(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				registrarPrestadorDto.id_usuario,
				registrarPrestadorDto.nombre,
				registrarPrestadorDto.apellido,
				registrarPrestadorDto.fecha_nacimiento,
				registrarPrestadorDto.nro_documento_identidad,
				registrarPrestadorDto.id_tipo_documento,
				registrarPrestadorDto.telefono,
				registrarPrestadorDto.id_localidad,
				registrarPrestadorDto.id_departamento,
				registrarPrestadorDto.id_provincia,
				registrarPrestadorDto.cuit,
				registrarPrestadorDto.razon_social,
				registrarPrestadorDto.sitio_web,
			],
		);
		return result[0][0];
	}

	async obtenerPermisosUsuario(id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_PERMISOS_X_USUARIO(?)',
			[id_usuario],
		);
		return result[0][0];
	}
}
