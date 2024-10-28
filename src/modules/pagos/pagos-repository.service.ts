import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class PagosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async guardarCodeVerifier(id_usuario: string, code_verifier: string) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_CODE_VERIFIER(?, ?)',
			[id_usuario, code_verifier],
		);
		return result[0][0];
	}
}
