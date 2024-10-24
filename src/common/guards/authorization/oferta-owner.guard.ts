import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class OfertaOwnerGuard implements CanActivate {
	constructor(@InjectEntityManager() private entityManager: EntityManager) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const id_usuario = request.user.id_usuario;

		const id_oferta = request.body?.id_oferta || request.params?.id_oferta;

		if (!id_oferta) {
			return false;
		}

		// Verifica si la oferta pertenece al usuario
		const resultado = await this.entityManager.query(
			`CALL SP_LISTAR_IDS_OFERTAS_TURISTICAS_X_USUARIO(?)`,
			[id_usuario],
		);
		const ofertas_usuario = resultado[0];

		const esOwner = ofertas_usuario.some(
			(oferta) => oferta.id_oferta_turistica === id_oferta,
		);

		return esOwner;
	}
}
